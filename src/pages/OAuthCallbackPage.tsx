import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        // Handle errors from GitHub
        if (error) {
          const errorDescription = searchParams.get('error_description') || 'Unknown error';
          toast.error(`OAuth Error: ${errorDescription}`);
          navigate('/login');
          return;
        }

        if (!token) {
          toast.error('No authentication token received');
          navigate('/login');
          return;
        }

        // Fetch user profile using the token
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const user = await response.json();

        // Store token and user data using the login method
        login(user, token);

        toast.success('Successfully logged in with GitHub!');
        navigate('/');
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to complete login');
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate your GitHub account.</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
