import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionStatus } from '@core/models/transaction.models';
import { LucideAngularModule, Check, X, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50" (click)="close()"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 z-10">
        <!-- Header -->
        <div class="px-6 py-4 border-b">
          <h2 class="text-xl font-semibold text-gray-900">Transaction Details</h2>
          <p class="mt-1 text-sm text-gray-500">Reference: {{ transaction?.reference }}</p>
        </div>

        <!-- Content -->
        <div class="px-6 py-4 space-y-4">
          <!-- Status -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">Status</span>
            <div class="flex items-center gap-2">
              <lucide-icon [img]="getStatusIcon()" [size]="18"></lucide-icon>
              <span
                [class]="
                  'inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium ' +
                  getStatusColor()
                "
              >
                {{ transaction?.status }}
              </span>
            </div>
          </div>

          <!-- Amount -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">Amount</span>
            <span class="text-sm font-medium text-gray-900">{{
              transaction?.amount | currency
            }}</span>
          </div>

          <!-- Reference -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">Reference</span>
            <span class="text-sm font-medium text-gray-900">{{ transaction?.reference }}</span>
          </div>

          <!-- Source Account -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">From</span>
            <span class="text-sm font-medium text-gray-900">{{ transaction?.sourceAccount }}</span>
          </div>

          <!-- Destination Account -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">To</span>
            <span class="text-sm font-medium text-gray-900">{{
              transaction?.destinationAccount
            }}</span>
          </div>

          <!-- Description -->
          <div>
            <span class="text-sm font-medium text-gray-500">Description</span>
            <p class="mt-1 text-sm text-gray-900">{{ transaction?.description }}</p>
          </div>

          <!-- Date -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">Date</span>
            <span class="text-sm font-medium text-gray-900">{{
              transaction?.createdAt | date: 'medium'
            }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t flex justify-end">
          <button
            (click)="close()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class TransactionDetailsComponent {
  @Input() isOpen = false;
  @Input() transaction: Transaction | null = null;
  @Output() closed = new EventEmitter<void>();

  protected readonly Check = Check;
  protected readonly X = X;
  protected readonly AlertTriangle = AlertTriangle;

  close(): void {
    this.closed.emit();
  }

  getStatusColor(): string {
    switch (this.transaction?.status) {
      case TransactionStatus.COMPLETED:
        return 'text-green-600 bg-green-50';
      case TransactionStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      case TransactionStatus.FAILED:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }

  getStatusIcon(): typeof Check | typeof X | typeof AlertTriangle {
    switch (this.transaction?.status) {
      case TransactionStatus.COMPLETED:
        return Check;
      case TransactionStatus.PENDING:
        return AlertTriangle;
      case TransactionStatus.FAILED:
        return X;
      default:
        return AlertTriangle;
    }
  }
}
