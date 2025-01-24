import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash2, CreditCard } from 'lucide-angular';
import { TransactionCartFacade } from '@core/services/transaction-cart.facade';
import { CartTransaction } from '@core/models/transaction-cart.models';

@Component({
  selector: 'app-transaction-cart-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">Panier de transactions</h2>
        <button
          (click)="clearCart()"
          class="text-sm text-red-600 hover:text-red-700"
          [class.invisible]="!(transactions$ | async)?.length"
        >
          Vider le panier
        </button>
      </div>

      <!-- Error message -->
      <div *ngIf="error$ | async as error" class="p-4 rounded-md bg-red-50 border border-red-200">
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>

      <!-- Cart status -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>{{ transactionCount$ | async }}/{{ maxTransactions }} transactions</span>
        <span>Total: {{ cartTotal$ | async | currency }}</span>
      </div>

      <!-- Transactions list -->
      <div class="space-y-2">
        <div
          *ngFor="let transaction of transactions$ | async"
          class="p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center justify-between">
            <!-- Transaction info -->
            <div class="flex items-center space-x-4">
              <lucide-icon [img]="CreditCard" [size]="20" class="text-gray-400"></lucide-icon>
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ getTransactionLabel(transaction) }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ transaction.description || 'Aucune description' }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
              <span
                class="text-sm font-medium"
                [class.text-green-600]="transaction.type === 'DEPOSIT'"
                [class.text-red-600]="transaction.type === 'WITHDRAWAL'"
                [class.text-blue-600]="transaction.type === 'TRANSFER'"
              >
                {{ transaction.amount | currency }}
              </span>
              <button
                (click)="removeTransaction(transaction.id)"
                class="text-gray-400 hover:text-red-600"
              >
                <lucide-icon [img]="Trash2" [size]="18"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="(transactionCount$ | async) === 0" class="text-center py-8 text-gray-500">
        <p>Votre panier est vide</p>
      </div>
    </div>
  `
})
export class TransactionCartListComponent {
  transactions$ = this.cartFacade.transactions$;
  cartTotal$ = this.cartFacade.cartTotal$;
  error$ = this.cartFacade.error$;
  transactionCount$ = this.cartFacade.transactionCount$;
  maxTransactions = 10;

  protected readonly CreditCard = CreditCard;
  protected readonly Trash2 = Trash2;

  constructor(private cartFacade: TransactionCartFacade) {}

  getTransactionLabel(transaction: CartTransaction): string {
    switch (transaction.type) {
      case 'DEPOSIT':
        return `Dépôt vers le compte ${transaction.destinationAccountId}`;
      case 'WITHDRAWAL':
        return `Retrait depuis le compte ${transaction.sourceAccountId}`;
      case 'TRANSFER':
        return `Virement du compte ${transaction.sourceAccountId} vers le compte ${transaction.destinationAccountId}`;
      default:
        return 'Transaction inconnue';
    }
  }

  removeTransaction(id: string): void {
    this.cartFacade.removeTransaction(id);
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.cartFacade.clearCart();
    }
  }
}
