import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function parseExpenseWithGemini(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Extract expense details and return ONLY valid JSON.

Fields:
- productName (string)
- price (number)
- category (string or null)
- groupName (string or null)

If information is missing, return null.

Input:
"${text}"
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  return JSON.parse(raw);
}
