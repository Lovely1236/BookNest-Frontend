import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GitFork, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-7 h-7 text-blue-400" />
              <span className="text-lg font-bold text-white">BookNest</span>
            </div>
            <p className="text-sm">Your cozy corner for every book lover. Browse, buy, and review your favourite reads.</p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/books" className="hover:text-white transition-colors">Browse Books</Link></li>
              <li><Link to="/books?sort=newest" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/books?sort=rating" className="hover:text-white transition-colors">Top Rated</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/wallet" className="hover:text-white transition-colors">Wallet</Link></li>
              <li><Link to="/notifications" className="hover:text-white transition-colors">Notifications</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@booknest.com</span>
              </li>
              <li className="flex items-center gap-2">
                <GitFork className="w-4 h-4" />
                <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BookNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
