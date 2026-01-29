import {api} from "./api";

export const notificationService = {
  async getAll() {
    const res = await api.get("/notifications");
    return res.data.data;
  },

  async markRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
  },

  async acceptInvite(notificationId: string) {
    await api.post(`/notifications/${notificationId}/accept`);
  },

  async rejectInvite(notificationId: string) {
    await api.post(`/notifications/${notificationId}/reject`);
  },
};
