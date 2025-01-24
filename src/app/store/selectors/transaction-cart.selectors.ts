import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransactionCartState } from '@core/models/transaction-cart.models';

export const selectTransactionCartState =
  createFeatureSelector<TransactionCartState>('transactionCart');

export const selectAllTransactions = createSelector(
  selectTransactionCartState,
  (state) => state.transactions
);

export const selectCartTotal = createSelector(selectAllTransactions, (transactions) =>
  transactions.reduce((total, transaction) => {
    switch (transaction.type) {
      case 'DEPOSIT':
        return total + transaction.amount;
      case 'WITHDRAWAL':
        return total - transaction.amount;
      case 'TRANSFER':
        return total; // Les transferts n'affectent pas le total
      default:
        return total;
    }
  }, 0)
);

export const selectCartError = createSelector(selectTransactionCartState, (state) => state.error);

export const selectCartCount = createSelector(
  selectAllTransactions,
  (transactions) => transactions.length
);

export const selectIsCartFull = createSelector(
  selectTransactionCartState,
  (state) => state.transactions.length >= state.maxTransactions
);
