import { Router } from "express";
import { PublicRoutes } from "./public.routes";
const router = Router();

router.use("", PublicRoutes);

export const AppRoutes = router;
