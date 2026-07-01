import crypto from "crypto";
import razorpay from "@/config/razorpay";
import { envConfig } from "@/config/index";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import validateWebhookSignature from "razorpay/dist/utils/razorpay-utils";
import { OrderModel } from "../order/order.model";

class RazorPayService {
  static async checkout(order: {
    total: number;
    currency: string;
    order_number: string; // Unique order number for the order
    notes?: { [key: string]: string }; // Optional notes for the order, backend should inject more details like orderId, customerId, etc. into this notes object
    description?: string; // Optional description for the order
  }) {
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: order?.total * 100,
        currency: order?.currency || "INR",
        receipt: order?.order_number,
        notes: order.notes,
      });
      return {
        key: envConfig.razorpay.keyId,
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder?.amount ? Number(razorpayOrder.amount) / 100 : 3,
        currency: razorpayOrder?.currency || "INR",
        description: order?.description || "Payment for order",
        notes: razorpayOrder?.notes,
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
    // retrieve the order from the database using the razorpay_order_id
    const order = await OrderModel.findOne({
      "payment_details.razorpay_order_id": payload.razorpay_order_id,
    });

    if (!order) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "Order not found for the given Razorpay Order ID."
      );
    }

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

    // update the order with the payment details
    order.payment_details = {
      razorpay_order_id: payload.razorpay_order_id,
      razorpay_payment_id: payload.razorpay_payment_id,
      razorpay_signature: payload.razorpay_signature,
      payment_status: "captured",
      paid_at: new Date(),
    };

    await order.save();

    return {
      paymentId: payload.razorpay_payment_id,
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
      const handler = this.razorpayHandlers[event.event];

      if (!handler) {
        return;
      }

      await handler.call(this, event);
    } catch (e) {
      console.error(e);
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid webhook JSON payload."
      );
    }
  }

  private static readonly razorpayHandlers: any = {
    "payment.authorized": this.handlePaymentAuthorized,
    "payment.captured": this.handlePaymentCaptured,
    "payment.failed": this.handlePaymentFailed,
    "refund.created": this.handleRefundCreated,
    "refund.processed": this.handleRefundProcessed,
    "refund.failed": this.handleRefundFailed,
    "order.paid": this.handleOrderPaid,
  };

  private static async handlePaymentCaptured(event: any) {
    const payment = event.payload.payment.entity;

    const order = await OrderModel.findOne({
      "payment_details.razorpay_order_id": payment.order_id,
    });

    if (!order) {
      return;
    }

    if (order.status === "paid") {
      return;
    }

    order.status = "paid";

    order.payment_details = {
      razorpay_order_id: payment.order_id,
      razorpay_payment_id: payment.id,
      razorpay_signature: order.payment_details?.razorpay_signature,

      payment_method: payment.method,

      payment_status: payment.status,

      paid_at: new Date(payment.created_at * 1000),
    };

    order.raw_payment_response = payment;

    await order.save();

    return {
      message: "Payment captured and order marked as paid.",
    };
  }

  private static async handlePaymentFailed(event: any) {
    const payment = event.payload.payment.entity;

    const order = await OrderModel.findOne({
      "payment_details.razorpay_order_id": payment.order_id,
    });

    if (!order) {
      return;
    }

    order.status = "failed";

    order.payment_details = {
      ...order.payment_details,

      razorpay_payment_id: payment.id,

      payment_method: payment.method,

      payment_status: payment.status,
    };

    await order.save();
  }

  private static async handlePaymentAuthorized(event: any) {
    const payment = event.payload.payment.entity;

    const order = await OrderModel.findOne({
      "payment_details.razorpay_order_id": payment.order_id,
    });

    if (!order) {
      return;
    }

    order.payment_details = {
      ...order.payment_details,

      razorpay_payment_id: payment.id,

      payment_method: payment.method,

      payment_status: payment.status,
    };

    await order.save();
  }

  private static async handleRefundCreated(event: any) {
    const refund = event.payload.refund.entity;

    console.log("Refund Created", refund.id);
  }

  private static async handleRefundProcessed(event: any) {
    const refund = event.payload.refund.entity;

    console.log("Refund Processed", refund.id);
  }

  private static async handleRefundFailed(event: any) {
    const refund = event.payload.refund.entity;

    console.log("Refund Failed", refund.id);
  }

  private static async handleOrderPaid(event: any) {
    console.log("Order Paid", event.payload.order.entity.id);

    const order = await OrderModel.findOne({
      "payment_details.razorpay_order_id": event.payload.order.entity.id,
    });

    if (!order) {
      return;
    }

    if (order.status === "paid") {
      return;
    }

    order.status = "paid";
    await order.save();

    return {
      message: "Order marked as paid.",
    };
  }
}

export default RazorPayService;
