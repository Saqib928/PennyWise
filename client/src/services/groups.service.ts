import { api } from "./api";

export interface CreateGroupRequest {
  name: string;
  memberIds: string[];
}

export interface GroupResponse {
  success: boolean;
  data?: {
    _id: string;
    name: string;
    members?: Array<any>;
  };
  message?: string;
}

export const GroupService = {
  getAll: () => api.get<GroupResponse>("/groups"),
  
  getOne: (id: string) => api.get<GroupResponse>(`/groups/${id}`),
  
  create: (data: CreateGroupRequest) => 
    api.post<GroupResponse>("/groups", data),

  getSettlement: (groupId: string) =>
    api.get<any>(`/groups/${groupId}/settlement`),

  settleAll: (groupId: string) =>
    api.post<any>(`/groups/${groupId}/settle`),
};
