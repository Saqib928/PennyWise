import { api } from "./api";

export interface ParsedExpense {
  product: string;
  amount: number;
  paid_by: string;
  group: string;
  category: string;
  split_type?: "equal" | "custom";
}

export const AIService = {
  parseExpense: (text: string) => 
    api.post<{ data: ParsedExpense }>("/ai/parse-expense", { text }),
    
  parseVoiceCommand: (transcript: string) =>
    api.post<{ data: ParsedExpense }>("/ai/parse-voice", { transcript }),
};
