import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useWallet, useWalletStatements } from '../hooks/useWallet';
import { WalletCard } from '../components/wallet/WalletCard';
import { TopUpForm } from '../components/wallet/TopUpForm';
import { TransactionHistory } from '../components/wallet/TransactionHistory';

export const WalletPage: React.FC = () => {
  const [showTopUp, setShowTopUp] = useState(false);
  const { data: wallet, isLoading } = useWallet();
  const { data: statementsData, isLoading: statementsLoading } = useWalletStatements();
  // console.log(statementsData?.statements);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Wallet className="w-6 h-6" />
        My Wallet
      </h1>

      <div className="space-y-6">
        <WalletCard wallet={wallet} isLoading={isLoading} onTopUp={() => setShowTopUp((p) => !p)} />

        {showTopUp && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 animate-slideDown">
            <h3 className="font-semibold text-gray-900 mb-4">Add Money to Wallet</h3>
            <TopUpForm onSuccess={() => setShowTopUp(false)} />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>
          <TransactionHistory
            statements={statementsData}
            isLoading={statementsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
