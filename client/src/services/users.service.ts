import { api } from "./api";
import type { User } from "../types/user.types";

export interface SearchUsersResponse {
  success: boolean;
  data?: User[];
  message?: string;
}

export const UsersService = {
  searchUsers: (query: string) =>
    api.get<SearchUsersResponse>(`/users/search?q=${encodeURIComponent(query)}`),
};
