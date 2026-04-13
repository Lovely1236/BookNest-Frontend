import React, { useState } from 'react';
import { useTopUpWallet } from '../../hooks/useWallet';

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2000];

interface TopUpFormProps {
  onSuccess?: () => void;
}

export const TopUpForm: React.FC<TopUpFormProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState('');
  const { mutate: topUp, isPending } = useTopUpWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    topUp(val, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmount(String(a))}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors"
          >
            ₹{a}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending || !amount}
        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Processing...' : 'Add Money'}
      </button>
    </form>
  );
};

export default TopUpForm;
