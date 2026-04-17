import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/api/notificationService';
import { useAuthStore } from '../stores/authStore';

export const useNotifications = () => {
  const { isAuthenticated } = useAuthStore();

  const { data: notifications, refetch: refetchAll } = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: notificationService.getAll,
    enabled: isAuthenticated,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: notificationService.getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
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
    notifications: notifications || [],
    unreadCount: unreadCount || 0,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    refetch: refetchAll,
  };
};
