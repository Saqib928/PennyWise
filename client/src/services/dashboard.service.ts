import { api } from "./api";

export interface DashboardSummary {
  totalSpent: number;
  youOwe: number;
  youGet: number;
  groups: number;
}

export interface DashboardResponse {
  success: boolean;
  data?: DashboardSummary;
  message?: string;
}

export const DashboardService = {
  getSummary: () =>
    api.get<DashboardResponse>("/dashboard/summary"),
};
