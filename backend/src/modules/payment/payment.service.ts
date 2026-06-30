import crypto from "crypto";
import razorpay from "@/config/razorpay";
import { envConfig } from "@/config/index";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";

class RazorPayService {
  static async createOrder(
    amount: number,
    receipt: string,
    notes?: Record<string, string>
  ) {
    return await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects the smallest currency unit (paise)
      currency: "INR",
      receipt,
      notes,
    });
  }

  static async fetchPayment(paymentId: string) {
    return await razorpay.payments.fetch(paymentId);
  }

  static async fetchOrder(orderId: string) {
    return await razorpay.orders.fetch(orderId);
  }

  private static readonly handlers = {
    "payment.authorized": this.handlePaymentAuthorized,
    "payment.captured": this.handlePaymentCaptured,
    "payment.failed": this.handlePaymentFailed,
    "refund.created": this.handleRefundCreated,
    "refund.processed": this.handleRefundProcessed,
  };

  static verifyPaymentSignature(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const generatedSignature = crypto
      .createHmac("sha256", envConfig.razorpay.keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    return generatedSignature === data.razorpay_signature;
  }

  static async handleWebhook(body: Buffer, signature: string) {
    const payload = body.toString("utf8");

    const verified = RazorPayService.verifyWebhookSignature(payload, signature);

    if (!verified) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid Razorpay webhook signature."
      );
    }

    let event: any;

    try {
      event = JSON.parse(payload);
    } catch {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid webhook JSON payload."
      );
    }

    if (!event?.event) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid webhook payload."
      );
    }

    const payment = event.payload?.payment?.entity;
    const refund = event.payload?.refund?.entity;

    console.log({
      event: event.event,
      refund,
      payment,
      account: event.account_id,
      createdAt: event.created_at,
    });

    const eventKey = event.event as keyof typeof RazorPayService.handlers;
    const handler = this.handlers[eventKey] as
      | ((payload: any) => Promise<void>)
      | undefined;

    if (handler) {
      if (event.event.startsWith("payment.")) {
        await handler.call(this, payment);
      } else if (event.event.startsWith("refund.")) {
        await handler.call(this, refund);
      } else {
        console.warn(`Unhandled Razorpay event: ${event.event}`);
      }
    }
  }

  static verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", envConfig.razorpay.webhookSecret)
      .update(payload)
      .digest("hex");

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(signature);

    if (expected.length !== received.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, received);
  }

  static async refundPayment(paymentId: string, amount?: number) {
    return await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined,
    });
  }

  static async handlePaymentAuthorized(payment: any) {
    console.log(payment.id);
  }

  static async handlePaymentCaptured(payment: any) {
    console.log(payment.id);
  }

  static async handlePaymentFailed(payment: any) {
    console.log(payment.id);
  }

  static async handleRefundCreated(refund: any) {
    console.log(refund.id);
  }

  static async handleRefundProcessed(refund: any) {
    console.log(refund.id);
  }
}

export default RazorPayService;
