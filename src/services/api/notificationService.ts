import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Notification } from '../../types/notification';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/notification/notifications/user/${user.userId}`);
    return data;
  },

  getUnread: async (): Promise<Notification[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/notification/notifications/user/${user.userId}`);
    return data.filter((n: Notification) => !n.read);
  },

  getUnreadCount: async (): Promise<number> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/notification/notifications/unread/${user.userId}`);
    return typeof data === 'number' ? data : 0;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/notification/notifications/read/${notificationId}`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    await apiClient.put(`/notification/notifications/readAll/${user.userId}`, {});
  },

  send: async (message: string, type: string = 'INFO'): Promise<Notification> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post(`/notification/notifications`, {
      userId: user.userId,
      type,
      message,
      read:false,
    });
    return data;
  },
};
