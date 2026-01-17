import { Request, Response } from "express";
import axios from "axios";

export async function parseExpense(req: Request, res: Response) {
  const { text } = req.body;
  try {
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        contents: [{ parts: [{ text: `Parse this expense statement: "${text}"` }] }],
      },
      { headers: { "x-goog-api-key": process.env.GEMINI_API_KEY! } }
    );

    const parsed = geminiResponse.data;
    res.json({ parsed });
  } catch (error: any) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to parse expense" });
  }
}
