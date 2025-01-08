import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Account, CreateAccountRequest, UpdateAccountRequest } from '@core/models/account.models';
import { PageResponse } from '@core/models/common.models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getAllAccounts(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Observable<PageResponse<Account>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<Account>>(this.apiUrl, { params });
  }

  getMyAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/my`);
  }

  getAccountsByUserId(userId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/${userId}`);
  }

  createAccount(request: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, request);
  }

  updateAccountStatus(id: number, request: UpdateAccountRequest): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}/status`, request);
  }

  updateAccountBalance(id: number, request: UpdateAccountRequest): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}/balance`, request);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
