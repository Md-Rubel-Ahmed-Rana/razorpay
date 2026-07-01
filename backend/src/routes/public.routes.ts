import { OrderRoutes } from "@/modules/order/order.route";
import { PaymentRoutes } from "@/modules/payment/payment.route";
import { Router } from "express";

const router = Router();

const routes: { path: string; route: Router }[] = [
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export const PublicRoutes = router;
