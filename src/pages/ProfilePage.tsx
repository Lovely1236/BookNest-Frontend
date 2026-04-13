import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { User, Lock, Save } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api/authService';
import { changePasswordSchema, ChangePasswordFormData } from '../utils/validation';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');

  const updateMutation = useMutation({
    mutationFn: () => authService.updateProfile({ fullName, mobile }),
    onSuccess: (updatedUser) => {
      updateProfile(updatedUser);
      toast.success('Profile updated!');
      setEditMode(false);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      authService.changePassword(data.oldPassword, data.newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      reset();
    },
    onError: () => toast.error('Failed to change password'),
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h2>
          <button
            onClick={() => setEditMode((p) => !p)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex gap-4">
              <span className="text-gray-500 w-24">Full Name</span>
              <span className="font-medium text-gray-900">{user?.fullName}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500 w-24">Email</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500 w-24">Mobile</span>
              <span className="font-medium text-gray-900">{user?.mobile || '—'}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500 w-24">Role</span>
              <span className="font-medium text-gray-900 capitalize">{user?.role?.toLowerCase()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" />
          Change Password
        </h2>

        <form onSubmit={handleSubmit((data) => changePasswordMutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              {...register('oldPassword')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.oldPassword && <p className="text-xs text-red-500 mt-1">{errors.oldPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              {...register('newPassword')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              {...register('confirmNewPassword')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmNewPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmNewPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
