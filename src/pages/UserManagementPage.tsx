import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, User } from 'lucide-react';
import { User as UserType } from '../types/auth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/formatters';
import { adminService } from '../services/api/adminService';

const fetchUsers = async (): Promise<UserType[]> => adminService.getUsers();

export const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: users, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: fetchUsers });

  const filtered = users?.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!isLoading && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered?.length ?? 0} users visible
        </p>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Mobile</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.mobile || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
