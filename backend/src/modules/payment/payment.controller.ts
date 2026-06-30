import BaseController from "@/shared/baseController";
import PaymentService from "./payment.service";

class Controller extends BaseController {
  checkout = this.catchAsync(async (req, res) => {
    const result = await PaymentService.checkout(req.body);
    this.sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Checkout created successfully.",
      data: result,
    });
  });

  verify = this.catchAsync(async (req, res) => {
    const result = await PaymentService.verify(req.body);
    this.sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment verified successfully.",
      data: result,
    });
  });

  getOrder = this.catchAsync(async (req, res) => {
    const result = await PaymentService.getOrder(req.params.orderId);
    this.sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment retrieved successfully.",
      data: result,
    });
  });

  handleWebhook = this.catchAsync(async (req, res) => {
    console.log(req.headers);
    console.log({ "razorpay-signature": req.headers["x-razorpay-signature"] });
    const signature = req.headers["x-razorpay-signature"];

    if (!signature || typeof signature !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing webhook signature.",
      });
    }
    await PaymentService.handleWebhook(req.body, signature);

    res.status(200).json({
      success: true,
    });
  });
}

export const PaymentController = new Controller();
