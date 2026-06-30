import BaseController from "@/shared/baseController";
import PaymentService from "./payment.service";

class Controller extends BaseController {
  createOrder = this.catchAsync(async (req, res) => {
    const { amount, receipt, notes } = req.body;
    const result = await PaymentService.createOrder(amount, receipt, notes);
    this.sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Payment order created successfully.",
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
