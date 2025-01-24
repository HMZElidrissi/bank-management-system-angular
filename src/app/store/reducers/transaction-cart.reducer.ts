import { createReducer, on } from '@ngrx/store';
import { TransactionCartState, initialState } from '@core/models/transaction-cart.models';
import * as TransactionCartActions from '../actions/transaction-cart.actions';

let nextId = 1; // Simple counter for generating IDs

export const transactionCartReducer = createReducer(
  initialState,

  on(TransactionCartActions.addTransaction, (state, { transaction }) => {
    if (state.transactions.length >= state.maxTransactions) {
      return {
        ...state,
        error: `Le panier ne peut pas contenir plus de ${state.maxTransactions} transactions`
      };
    }

    const newTransaction = {
      ...transaction,
      id: `cart-${nextId++}`, // Simple incrementing ID with prefix
      createdAt: new Date()
    };

    return {
      ...state,
      transactions: [...state.transactions, newTransaction],
      error: null
    };
  }),

  on(TransactionCartActions.updateTransaction, (state, { id, transaction }) => {
    const transactionIndex = state.transactions.findIndex((t) => t.id === id);
    if (transactionIndex === -1) {
      return {
        ...state,
        error: 'Transaction non trouvée'
      };
    }

    const updatedTransactions = [...state.transactions];
    updatedTransactions[transactionIndex] = {
      ...updatedTransactions[transactionIndex],
      ...transaction
    };

    return {
      ...state,
      transactions: updatedTransactions,
      error: null
    };
  }),

  on(TransactionCartActions.removeTransaction, (state, { id }) => ({
    ...state,
    transactions: state.transactions.filter((t) => t.id !== id),
    error: null
  })),

  on(TransactionCartActions.clearCart, (state) => {
    nextId = 1; // Reset the ID counter when clearing the cart
    return {
      ...state,
      transactions: [],
      error: null
    };
  }),

  on(TransactionCartActions.setError, (state, { error }) => ({
    ...state,
    error
  })),

  on(TransactionCartActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
