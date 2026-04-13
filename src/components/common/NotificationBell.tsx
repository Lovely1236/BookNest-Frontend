import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/formatters';

interface NotificationBellProps {
  unreadCount: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount }) => {
  const [open, setOpen] = useState(false);
  const { unreadNotifications, markAsRead } = useNotifications();

  const preview = unreadNotifications?.slice(0, 5) || [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-100 animate-slideDown z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {preview.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
            ) : (
              preview.map((n) => (
                <div
                  key={n.notificationId}
                  onClick={() => markAsRead(n.notificationId)}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
