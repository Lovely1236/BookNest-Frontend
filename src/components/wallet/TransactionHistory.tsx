import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Statement } from '../../types/wallet';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TransactionHistoryProps {
  statements?: Statement[];
  isLoading?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  statements = [],
  isLoading = false,
}) => {
  if (isLoading) return <LoadingSpinner />;

  if (statements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {statements.map((s) => (
        <div
          key={s.statementId}
          className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.transactionType === 'DEPOSIT' ? 'bg-green-100' : 'bg-red-100'}`}>
              {s.transactionType === 'DEPOSIT' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{s.transactionRemarks}</p>
              <p className="text-xs text-gray-500">{formatDateTime(s.dateTime)}</p>
              {s.orderId && (
                <p className="text-xs text-gray-400">Order #{s.orderId}</p>
              )}
            </div>
          </div>
          <p className={`font-bold ${s.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
            {s.transactionType === 'DEPOSIT' ? '+' : '-'}
            {formatCurrency(s.amount)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
