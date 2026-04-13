import apiClient from '../axios';
import { Notification } from '../../types/notification';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get('/notifications');
    return data;
  },

  getUnread: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get('/notifications/unread');
    return data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },
};
