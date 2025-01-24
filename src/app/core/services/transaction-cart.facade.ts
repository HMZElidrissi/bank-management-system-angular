import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartTransaction } from '../models/transaction-cart.models';
import * as TransactionCartActions from '@store/actions/transaction-cart.actions';
import * as TransactionCartSelectors from '@store/selectors/transaction-cart.selectors';
import { TransactionCartValidatorService } from './transaction-cart-validator.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionCartFacade {
  transactions$ = this.store.select(TransactionCartSelectors.selectAllTransactions);
  cartTotal$ = this.store.select(TransactionCartSelectors.selectCartTotal);
  error$ = this.store.select(TransactionCartSelectors.selectCartError);
  isCartFull$ = this.store.select(TransactionCartSelectors.selectIsCartFull);
  transactionCount$ = this.store.select(TransactionCartSelectors.selectCartCount);

  constructor(
    private store: Store,
    private validator: TransactionCartValidatorService
  ) {}

  addTransaction(transaction: Omit<CartTransaction, 'id' | 'createdAt'>): void {
    const error = this.validator.validateTransaction(transaction);
    if (error) {
      this.store.dispatch(TransactionCartActions.setError({ error }));
      return;
    }

    this.store.dispatch(TransactionCartActions.addTransaction({ transaction }));
  }

  updateTransaction(id: string, transaction: Partial<CartTransaction>): void {
    const error = this.validator.validateTransaction(transaction);
    if (error) {
      this.store.dispatch(TransactionCartActions.setError({ error }));
      return;
    }

    this.store.dispatch(TransactionCartActions.updateTransaction({ id, transaction }));
  }

  removeTransaction(id: string): void {
    this.store.dispatch(TransactionCartActions.removeTransaction({ id }));
  }

  clearCart(): void {
    this.store.dispatch(TransactionCartActions.clearCart());
  }

  clearError(): void {
    this.store.dispatch(TransactionCartActions.clearError());
  }
}
