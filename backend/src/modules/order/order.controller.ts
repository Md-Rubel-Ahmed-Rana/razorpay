import BaseController from "@/shared/baseController";
import { OrderService } from "./order.service";
import { HttpStatusCode } from "@/lib/httpStatus";

class Controller extends BaseController {
  create = this.catchAsync(async (req, res) => {
    const result = await OrderService.create(req.body);
    this.sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      message: "Order created successfully.",
      data: result,
    });
  });
}

export const OrderController = new Controller();
