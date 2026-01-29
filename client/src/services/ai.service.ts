import { api } from "./api";

export async function voiceExpense(blob: Blob) {
  const form = new FormData();
  form.append("audio", blob);

  const res = await api.post("/ai/voice-expense", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return res.data.data;
}
