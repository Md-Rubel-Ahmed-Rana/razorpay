import validateRequest from "@/middlewares/validateRequest";
import { Router } from "express";
import { createOrderValidation } from "./order.validation";
import { OrderController } from "./order.controller";

const router = Router();

router.post(
  "/",
  validateRequest(createOrderValidation),
  OrderController.create
);

export const OrderRoutes = router;
