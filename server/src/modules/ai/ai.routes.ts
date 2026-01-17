import { Router } from "express";
import { parseExpense } from "./ai.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/parse-expense", requireAuth, parseExpense);

export default router;
