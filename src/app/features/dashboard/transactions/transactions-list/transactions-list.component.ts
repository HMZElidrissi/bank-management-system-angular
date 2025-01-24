import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChevronLeft, ChevronRight, Filter, LucideAngularModule, Search } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

import { TransactionService } from '@core/services/transaction.service';
import { AuthService } from '@core/services/auth.service';
import { Transaction, TransactionStatus, TransactionType } from '@core/models/transaction.models';
import { PaginatedComponent } from '@shared/components/paginated/paginated.component';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    TransactionDetailsComponent
  ],
  templateUrl: './transactions-list.component.html'
})
export class TransactionsListComponent extends PaginatedComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = false;
  error: string | null = null;
  isAdmin = false;
  isEmployee = false;
  filterForm!: FormGroup;

  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly Filter = Filter;
  protected readonly Math = Math;
  protected readonly TransactionStatus = TransactionStatus;
  protected readonly TransactionType = TransactionType;
  showFilters: boolean = false;
  showTransactionDetails = false;
  selectedTransaction: Transaction | null = null;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    super();
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.isEmployee = this.authService.hasRole('EMPLOYEE');
    this.initFilterForm();
  }

  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      type: [''],
      status: [''],
      minAmount: [''],
      maxAmount: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.setupFilterSubscription();
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 0;
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      ...this.filterForm.value,
      startDate: this.filterForm.value.startDate ? new Date(this.filterForm.value.startDate) : null,
      endDate: this.filterForm.value.endDate ? new Date(this.filterForm.value.endDate) : null
    };

    this.transactionService
      .searchTransactions(filters, this.currentPage, this.pageSize, this.sortBy, this.sortDir)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.transactions = response.content;
          this.currentPage = response.pageNo;
          this.pageSize = response.pageSize;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
        },
        error: (error) => {
          this.error = 'Failed to load transactions';
          console.error('Error loading transactions:', error);
        }
      });
  }

  approveTransaction(id: number): void {
    if (!confirm('Are you sure you want to approve this transaction?')) return;

    this.loading = true;
    this.transactionService
      .approveTransaction(id, { approved: true })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.loadData();
        },
        error: (error) => {
          this.error = 'Failed to approve transaction';
          console.error('Error approving transaction:', error);
        }
      });
  }

  rejectTransaction(id: number): void {
    if (!confirm('Are you sure you want to reject this transaction?')) return;

    this.loading = true;
    this.transactionService
      .approveTransaction(id, { approved: false })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.loadData();
        },
        error: (error) => {
          this.error = 'Failed to reject transaction';
          console.error('Error rejecting transaction:', error);
        }
      });
  }

  getStatusClass(status: TransactionStatus): string {
    switch (status) {
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

  openTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.showTransactionDetails = true;
  }

  onCloseTransactionDetails(): void {
    this.showTransactionDetails = false;
    this.selectedTransaction = null;
  }
}
