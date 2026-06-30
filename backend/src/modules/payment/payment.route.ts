import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/checkout", PaymentController.checkout);

router.post("/verify", PaymentController.verify);

router.get("/status/:orderId", PaymentController.getOrder);

router.post("/webhook", PaymentController.handleWebhook);

export const PaymentRoutes = router;
