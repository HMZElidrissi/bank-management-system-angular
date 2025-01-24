import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from '@features/dashboard/transactions/transaction-form/transaction-form.component';
import { TransactionCartListComponent } from '@features/dashboard/transactions/transaction-cart-list/transaction-cart-list.component';

@Component({
  selector: 'app-transaction-cart',
  standalone: true,
  imports: [CommonModule, TransactionFormComponent, TransactionCartListComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Transaction Form -->
        <div class="bg-white p-6 rounded-lg border shadow-sm">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Nouvelle transaction</h2>
          <app-transaction-form></app-transaction-form>
        </div>

        <!-- Transaction Cart -->
        <div class="bg-white p-6 rounded-lg border shadow-sm">
          <app-transaction-cart-list></app-transaction-cart-list>
        </div>
      </div>
    </div>
  `
})
export class TransactionCartComponent {}
