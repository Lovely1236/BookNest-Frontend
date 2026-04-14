import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { formatRelativeTime } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {!notifications ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.notificationId}
              onClick={() => !n.read && markAsRead(n.notificationId)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                !n.read
                  ? 'bg-blue-50 border-blue-100 hover:bg-blue-100/50'
                  : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                  {n.message}
                </p>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
