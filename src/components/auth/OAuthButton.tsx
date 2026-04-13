import React from 'react';
import { GitFork } from 'lucide-react';
import { GITHUB_OAUTH_ID, GITHUB_REDIRECT_URI } from '../../utils/constants';

export const OAuthButton: React.FC = () => {
  const handleGitHubLogin = () => {
    const params = new URLSearchParams({
      client_id: GITHUB_OAUTH_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'user:email',
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  };

  return (
    <button
      onClick={handleGitHubLogin}
      className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <GitFork className="w-5 h-5" />
      Continue with GitHub
    </button>
  );
};

export default OAuthButton;
