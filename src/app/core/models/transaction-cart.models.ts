export interface CartTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  sourceAccountId?: number;
  destinationAccountId?: number;
  description?: string;
  createdAt: Date;
}

export interface TransactionCartState {
  transactions: CartTransaction[];
  loading: boolean;
  error: string | null;
  maxTransactions: number;
}

export const initialState: TransactionCartState = {
  transactions: [],
  loading: false,
  error: null,
  maxTransactions: 10
};
