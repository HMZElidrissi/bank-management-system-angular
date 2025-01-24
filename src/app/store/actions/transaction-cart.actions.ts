import { createAction, props } from '@ngrx/store';
import { CartTransaction } from '@core/models/transaction-cart.models';

export const addTransaction = createAction(
  '[Transaction Cart] Add Transaction',
  props<{ transaction: Omit<CartTransaction, 'id' | 'createdAt'> }>()
);

export const updateTransaction = createAction(
  '[Transaction Cart] Update Transaction',
  props<{ id: string; transaction: Partial<CartTransaction> }>()
);

export const removeTransaction = createAction(
  '[Transaction Cart] Remove Transaction',
  props<{ id: string }>()
);

export const clearCart = createAction('[Transaction Cart] Clear Cart');

export const validateTransaction = createAction(
  '[Transaction Cart] Validate Transaction',
  props<{ transaction: CartTransaction }>()
);

export const setError = createAction('[Transaction Cart] Set Error', props<{ error: string }>());

export const clearError = createAction('[Transaction Cart] Clear Error');
