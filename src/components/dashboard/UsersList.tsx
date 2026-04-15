import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api/adminService';
import { User } from 'lucide-react';

export const UsersList: React.FC = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminService.getUsers(),
  });

  const limitedUsers = users?.slice(0, 8) || [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" />
          Recent Users
        </h3>
        <span className="text-sm text-gray-500">
          Total: {users?.length || 0}
        </span>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : limitedUsers.length > 0 ? (
        <div className="space-y-3">
          {limitedUsers.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.fullName || 'No Name'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="text-right ml-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.role || 'CUSTOMER'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
};

export default UsersList;
