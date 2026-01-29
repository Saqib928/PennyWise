import { Request, Response } from "express";
import {
  speechToTextGemini,
  parseExpenseFromText
} from "./ai.service";

/**
 * AUDIO → TEXT → JSON (Single Pipeline)
 */
export async function voiceExpensePipeline(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio required" });
    }

    const base64Audio = req.file.buffer.toString("base64");

    // STEP 1 — Speech → Text
    const text = await speechToTextGemini(base64Audio, req.file.mimetype);

    // STEP 2 — Text → JSON
    const parsed = await parseExpenseFromText(text);

    res.json({
      success: true,
      data: {
        rawText: text,
        parsed
      }
    });

  } catch (err) {
    console.error("Voice Pipeline Error:", err);
    res.status(500).json({
      success: false,
      message: "Voice processing failed"
    });
  }
}
