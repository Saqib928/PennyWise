import { api } from "./api";

export const ExpenseService = {
  getByGroup: (id: string) => api.get(`/expenses?groupId=${id}`)
};
