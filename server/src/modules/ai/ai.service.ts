import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * STEP 1 — Speech → Text
 */
export async function speechToTextGemini(
  audioBase64: string,
  mimeType: string = "audio/webm"
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: audioBase64
      }
    },
    "Convert this speech audio to plain English text. Only return text."
  ]);

  return result.response.text().trim();
}

/**
 * STEP 2 — Text → Expense JSON
 */
export async function parseExpenseFromText(text: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
Extract expense details from text.

Return STRICT JSON ONLY.

Schema:
{
  "title": string,
  "amount": number,
  "category": string
}

Rules:
- Title = item name
- Amount = number only
- Category = one of [Food, Travel, Shopping, Other]

Text:
${text}
`;

  const result = await model.generateContent(prompt);

  const raw = result.response.text();

  try {
    return JSON.parse(raw);
  } catch {
    return {
      title: text,
      amount: 0,
      category: "Other"
    };
  }
}
