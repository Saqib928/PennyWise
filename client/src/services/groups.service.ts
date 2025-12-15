import { api } from "./api";

export const GroupService = {
  getAll: () => api.get("/groups"),
  getOne: (id: string) => api.get(`/groups/${id}`),
};
