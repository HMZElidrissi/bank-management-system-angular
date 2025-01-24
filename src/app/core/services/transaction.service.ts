import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PageResponse } from '@core/models/common.models';
import {
  Transaction,
  CreateTransactionRequest,
  TransactionSearchCriteria,
  TransactionApprovalRequest
} from '@core/models/transaction.models';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  createTransaction(request: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, request);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getTransactionByReference(reference: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/reference/${reference}`);
  }

  searchTransactions(
    criteria: TransactionSearchCriteria,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Observable<PageResponse<Transaction>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (criteria.accountId) params = params.set('accountId', criteria.accountId.toString());
    if (criteria.type) params = params.set('type', criteria.type);
    if (criteria.status) params = params.set('status', criteria.status);
    if (criteria.startDate) params = params.set('startDate', criteria.startDate.toISOString());
    if (criteria.endDate) params = params.set('endDate', criteria.endDate.toISOString());
    if (criteria.minAmount) params = params.set('minAmount', criteria.minAmount.toString());
    if (criteria.maxAmount) params = params.set('maxAmount', criteria.maxAmount.toString());

    return this.http.get<PageResponse<Transaction>>(`${this.apiUrl}/search`, { params });
  }

  approveTransaction(id: number, request: TransactionApprovalRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/${id}/approve`, request);
  }

  getAccountTransactions(
    accountId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Observable<PageResponse<Transaction>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<Transaction>>(`${this.apiUrl}/account/${accountId}`, {
      params
    });
  }
}
