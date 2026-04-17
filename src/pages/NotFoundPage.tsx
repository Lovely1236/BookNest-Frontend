import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
      <BookOpen className="w-24 h-24 text-gray-200 mb-6" />
      <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
      >
        <Home className="w-5 h-5" />
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
