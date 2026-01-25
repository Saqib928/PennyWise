import { api } from "./api";

// Response interface matching YOUR actual JSON output
export interface GroupResponse {
  success?: boolean;
  groups?: any[]; // Added this based on your JSON dump
  data?: any;
  message?: string;
}

export const GroupService = {
  // Returns the raw response so we can handle different structures in the component
  getAll: () => api.get<GroupResponse>("/groups"),
  
  getOne: (id: string) => api.get<GroupResponse>(`/groups/${id}`),
  
  create: (data: { name: string; memberIds: string[] }) => 
    api.post<GroupResponse>("/groups", data),

  getSettlement: (groupId: string) =>
    api.get<any>(`/groups/${groupId}/settlement`),

  settleAll: (groupId: string) =>
    api.post<any>(`/groups/${groupId}/settle`),
};