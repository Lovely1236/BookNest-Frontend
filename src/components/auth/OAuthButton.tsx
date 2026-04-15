import React from 'react';
import { GitFork } from 'lucide-react';

export const OAuthButton: React.FC = () => {
  const handleGitHubLogin = () => {
    // Redirect to auth-service OAuth endpoint through the API Gateway
    // Auth-service will handle the GitHub OAuth flow and redirect back with JWT token
    window.location.href = 'http://localhost:8080/api/auth/oauth2/authorization/github';
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
