import { Request, Response } from "express";
import { parseExpenseWithGemini } from "./ai.service";

export async function parseExpense(req: Request, res: Response) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  const parsed = await parseExpenseWithGemini(text);

  res.json({ success: true, data: parsed });
}
