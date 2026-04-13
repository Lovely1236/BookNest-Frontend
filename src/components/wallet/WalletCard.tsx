import React from 'react';
import { Wallet as WalletIcon, TrendingUp, Plus } from 'lucide-react';
import { Wallet } from '../../types/wallet';
import { formatCurrency } from '../../utils/formatters';

interface WalletCardProps {
  wallet?: Wallet;
  isLoading?: boolean;
  onTopUp?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, isLoading, onTopUp }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-4" />
        <div className="h-10 bg-white/20 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <WalletIcon className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">My Wallet</span>
        </div>
        <TrendingUp className="w-5 h-5 opacity-60" />
      </div>

      <p className="text-3xl font-bold mt-4">
        {wallet ? formatCurrency(wallet.currentBalance) : '—'}
      </p>
      <p className="text-sm opacity-75 mt-1">Available Balance</p>

      {onTopUp && (
        <button
          onClick={onTopUp}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Money
        </button>
      )}
    </div>
  );
};

export default WalletCard;
