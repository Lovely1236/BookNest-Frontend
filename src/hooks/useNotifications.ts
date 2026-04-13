import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/api/notificationService';
import { useAuthStore } from '../stores/authStore';

export const useNotifications = () => {
  const { isAuthenticated } = useAuthStore();

  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAll,
    enabled: isAuthenticated,
  });

  const { data: unreadNotifications } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationService.getUnread,
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    unreadNotifications,
    unreadCount: unreadNotifications?.length || 0,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    refetch,
  };
};
