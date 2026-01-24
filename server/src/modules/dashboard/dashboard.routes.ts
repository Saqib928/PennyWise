import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { getDashboardSummary } from "./dashboard.controller";

const router = Router();
router.get("/summary", requireAuth, getDashboardSummary);
export default router;
