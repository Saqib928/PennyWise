import { api } from "./api";
import type { Group } from "../types/group.types";

// Flexible interface to match your backend's inconsistent responses
export interface GroupResponse {
  success: boolean;
  // The backend might return 'groups' array, 'group' object, or 'data'
  groups?: Group[]; 
  group?: Group;
  data?: Group | Group[]; 
  message?: string;
}

export const GroupService = {
  // Get all groups
  getAll: () => api.get<GroupResponse>("/groups"),
  
  // Get single group
  getOne: (id: string) => api.get<GroupResponse>(`/groups/${id}`),
  
  create: (data: { name: string; memberIds: string[] }) => 
    api.post<GroupResponse>("/groups", data),

  delete: (id: string) => api.delete<{ success: boolean; message?: string }>(`/groups/${id}`),

  addMember: (groupId: string, userId: string) => 
    api.post<GroupResponse>(`/groups/${groupId}/members`, { userId }),

  removeMember: (groupId: string, userId: string) => 
    api.delete<GroupResponse>(`/groups/${groupId}/members/${userId}`),

  getSettlement: (groupId: string) =>
    api.get<any>(`/groups/${groupId}/settlement`),

  settleAll: (groupId: string) =>
    api.post<any>(`/groups/${groupId}/settle`),
};