import crypto from "crypto";
import razorpay from "@/config/razorpay";
import { envConfig } from "@/config/index";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import validateWebhookSignature from "razorpay/dist/utils/razorpay-utils";

class RazorPayService {
  static async checkout(order: any) {
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: order?.total * 100,
        currency: order?.currency || "INR",
        receipt: order?.order_number,
        notes: order.notes,
      });
      return {
        key: envConfig.razorpay.keyId,
        orderId: razorpayOrder.id,
        amount: razorpayOrder?.amount || 55,
        currency: razorpayOrder?.currency || "INR",
        name: order?.shipping_address?.name || "RazorPay Test Payment",
        description: "Order Payment",
        prefill: {
          name: order?.shipping_address?.name || "Rubel",
          email: order?.shipping_address?.email || "rubel@gmail.com",
          contact: order?.shipping_address?.phone || "phone number",
        },
        notes: razorpayOrder?.notes || { note: "This is note" },
      };
    } catch (error) {
      console.log(error);
      throw new ApiError(HttpStatusCode.BAD_REQUEST, "Failed to checkout.");
    }
  }

  private static async fetchPayment(paymentId: string) {
    return await razorpay.payments.fetch(paymentId);
  }

  static async getOrder(orderId: string) {
    const order = await razorpay.orders.fetch(orderId);

    return {
      id: order.id,

      receipt: order.receipt,

      status: order.status,

      amount: (order.amount as number) / 100,

      currency: order.currency,

      amountPaid: order.amount_paid / 100,

      amountDue: order.amount_due / 100,

      attempts: order.attempts,

      createdAt: new Date(order.created_at * 1000).toISOString(),

      notes: {
        orderId: order.notes?.orderId ?? null,
        customerId: order.notes?.customerId ?? null,
      },
    };
  }

  static async verify(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const generatedSignature = crypto
      .createHmac("sha256", envConfig.razorpay.keySecret)
      .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
      .digest("hex");

    const verified = generatedSignature === payload.razorpay_signature;

    if (!verified) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Payment verification failed."
      );
    }

    const payment = await this.fetchPayment(payload.razorpay_payment_id);

    if (payment.status !== "captured") {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, "Payment not captured.");
    }

    return {
      paymentId: payment,
    };
  }

  static async handleWebhook(body: Buffer, signature: string) {
    const payload = body.toString("utf8");

    const verified = validateWebhookSignature.validateWebhookSignature(
      payload,
      signature,
      envConfig.razorpay.webhookSecret
    );

    if (!verified) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid Razorpay webhook signature."
      );
    }

    let event;

    try {
      event = JSON.parse(payload);
      console.log(event);
    } catch (e) {
      console.error(e);
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid webhook JSON payload."
      );
    }
  }
}

export default RazorPayService;
