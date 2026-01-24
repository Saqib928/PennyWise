import { Router } from "express";
import { createExpense, getExpenses, markAsPaid } from "./expense.controller";
import { requireAuth } from "../../middlewares/auth";

const router = Router();

router.post("/", requireAuth, createExpense);
router.get("/", requireAuth, getExpenses);
router.patch("/:expenseId/mark-paid", requireAuth, markAsPaid);

export default router;
