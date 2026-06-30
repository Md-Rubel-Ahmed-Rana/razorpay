import crypto from "crypto";
import razorpay from "@/config/razorpay";
import { envConfig } from "@/config/index";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import validateWebhookSignature from "razorpay/dist/utils/razorpay-utils";

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

  static verifyWebhookSignature(payload: string, signature: string): boolean {
    const isValid = validateWebhookSignature.validateWebhookSignature(
      payload,
      signature,
      envConfig.razorpay.webhookSecret
    );
    console.log({ isValidSignature: isValid });
    const expectedSignature = crypto
      .createHmac("sha256", envConfig.razorpay.webhookSecret)
      .update(payload)
      .digest("hex");

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(signature);
    console.log({ expectedSignature, expected, received });

    if (expected.length !== received.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, received);
  }

  static async handleWebhook(body: Buffer, signature: string) {
    console.log({ isBuffer: body instanceof Buffer });
    console.log({ bodyLength: body.length });
    console.log({ bodyString: body.toString("utf8") });
    console.log({ razorpayCredentials: envConfig.razorpay.webhookSecret });
    console.log("Step 1");

    const payload = body.toString("utf8");

    console.log("Step 2");

    const verified = RazorPayService.verifyWebhookSignature(payload, signature);

    console.log("Step 3", verified);

    if (!verified) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid Razorpay webhook signature."
      );
    }

    console.log("Step 4");

    let event;

    try {
      event = JSON.parse(payload);
      console.log("Step 5");
    } catch (e) {
      console.error(e);
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid webhook JSON payload."
      );
    }

    console.log(event);
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
