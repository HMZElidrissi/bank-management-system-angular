import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  getPageNumbers(currentPage: number, totalPages: number, totalDisplayPages: number = 5): number[] {
    const pageNumbers: number[] = [];
    const halfDisplay = Math.floor(totalDisplayPages / 2);

    let startPage = Math.max(0, currentPage - halfDisplay);
    let endPage = Math.min(totalPages - 1, startPage + totalDisplayPages - 1);

    if (endPage - startPage + 1 < totalDisplayPages) {
      startPage = Math.max(0, endPage - totalDisplayPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }
}
