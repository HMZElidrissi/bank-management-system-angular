import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Account, AccountStatus } from '@core/models/account.models';
import { AccountService } from '@core/services/account.service';
import { AuthService } from '@core/services/auth.service';
import {
  LucideAngularModule,
  PlusCircle,
  Edit,
  Trash2,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-angular';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './accounts-list.component.html'
})
export class AccountsListComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  error: string | null = null;
  isAdmin = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sortBy = 'id';
  sortDir = 'asc';

  protected readonly PlusCircle = PlusCircle;
  protected readonly Edit = Edit;
  protected readonly Trash2 = Trash2;
  protected readonly Ban = Ban;
  protected readonly Check = Check;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly Math = Math;
  protected readonly AccountStatus = AccountStatus;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.hasRole('ADMIN');
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.error = null;

    if (this.isAdmin) {
      this.accountService
        .getAllAccounts(this.currentPage, this.pageSize, this.sortBy, this.sortDir)
        .subscribe({
          next: (response) => {
            this.accounts = response.content;
            this.currentPage = response.pageNo;
            this.pageSize = response.pageSize;
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Failed to load accounts';
            this.loading = false;
            console.error('Error loading accounts:', error);
          }
        });
    } else {
      this.accountService.getMyAccounts().subscribe({
        next: (response) => {
          this.accounts = response;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load accounts';
          this.loading = false;
          console.error('Error loading accounts:', error);
        }
      });
    }
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAccounts();
    }
  }

  updateSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDir = 'asc';
    }
    this.loadAccounts();
  }

  updateAccountStatus(id: number, status: AccountStatus): void {
    this.loading = true;
    this.accountService.updateAccountStatus(id, { amount: 0, status }).subscribe({
      next: () => {
        this.loadAccounts();
      },
      error: (error) => {
        this.error = 'Failed to update account status';
        this.loading = false;
        console.error('Error updating account status:', error);
      }
    });
  }

  deleteAccount(id: number): void {
    if (!confirm('Are you sure you want to delete this account?')) return;

    this.loading = true;
    this.accountService.deleteAccount(id).subscribe({
      next: () => {
        this.loadAccounts();
      },
      error: (error) => {
        this.error = 'Failed to delete account';
        this.loading = false;
        console.error('Error deleting account:', error);
      }
    });
  }

  getStatusColor(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.ACTIVE:
        return 'text-green-600 bg-green-50';
      case AccountStatus.BLOCKED:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }

  get pageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const totalDisplayPages = 5;
    const halfDisplay = Math.floor(totalDisplayPages / 2);

    let startPage = Math.max(0, this.currentPage - halfDisplay);
    let endPage = Math.min(this.totalPages - 1, startPage + totalDisplayPages - 1);

    if (endPage - startPage + 1 < totalDisplayPages) {
      startPage = Math.max(0, endPage - totalDisplayPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }
}
