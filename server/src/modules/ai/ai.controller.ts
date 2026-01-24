import { Request, Response } from "express";
import axios from "axios";

export async function parseExpense(req: Request, res: Response) {
  const { text } = req.body;

  const prompt = `
Extract expense data from this sentence and return ONLY valid JSON.

Fields:
productName (string)
price (number)
category (string)
paidBy (string)
group (string)

Sentence:
"${text}"
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
      }
    );

    const rawText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    const parsedJSON = JSON.parse(rawText);

    res.json({ data: parsedJSON });
  } catch (error) {
    console.error("Gemini parsing failed", error);
    res.status(500).json({ message: "AI parsing failed" });
  }
}
