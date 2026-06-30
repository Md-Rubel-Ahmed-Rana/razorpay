import { Router } from "express";

const router = Router();

const routes: Record<string, Router>[] = [];

routes.forEach((route) => router.use(route.path, route.route));

export const AdminRoutes = router;
