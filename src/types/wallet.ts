export interface Wallet {
  walletId: number;
  currentBalance: number;
}

export interface Statement {
  statementId: number;
  transactionType: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  dateTime: string;
  orderId?: number;
  transactionRemarks: string;
}
