import { Router } from "express";
import validateRequest from "@/middlewares/validateRequest";
import { createOrderValidation } from "./payment.validation";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/",
  validateRequest(createOrderValidation),
  PaymentController.createOrder
);

router.post("/webhook", PaymentController.handleWebhook);

export const PaymentRoutes = router;
