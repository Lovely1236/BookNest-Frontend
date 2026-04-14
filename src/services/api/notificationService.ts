import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Notification } from '../../types/notification';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/notifications/user/${user.userId}`);
    return data;
  },

  getUnread: async (): Promise<Notification[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/notifications/unread/${user.userId}`);
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/notifications/unread/${user.userId}`);
    return typeof data === 'number' ? data : (data as any).count || 0;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/notifications/read/${notificationId}`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    await apiClient.put(`/notifications/readAll/${user.userId}`, {});
  },
};
