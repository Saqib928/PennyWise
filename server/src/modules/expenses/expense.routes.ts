import { Router } from "express";
import { createExpense, getExpenses, markAsPaid } from "./expense.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/", requireAuth, createExpense);
router.get("/", requireAuth, getExpenses);
router.patch("/:expenseId/splits/:userId", requireAuth, markAsPaid);

export default router;
