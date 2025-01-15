import { Directive, inject } from '@angular/core';
import { PaginationService } from '@core/services/pagination.service';

@Directive()
export abstract class PaginatedComponent {
  protected currentPage = 0;
  protected pageSize = 10;
  protected totalElements = 0;
  protected totalPages = 0;
  protected sortBy = 'id';
  protected sortDir = 'asc';

  private paginationService = inject(PaginationService);

  get pageNumbers(): number[] {
    return this.paginationService.getPageNumbers(this.currentPage, this.totalPages);
  }

  protected abstract loadData(): void;

  protected changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }

  protected updateSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDir = 'asc';
    }
    this.loadData();
  }
}
