import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IBusinessSummaryListItem } from '../domain/business';
import { IMonthlySummary } from '../domain/summary/summary';
import {
  ICreateTransactionRequest,
  ITransaction,
} from '../domain/transaction/transaction';

@Service()
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getBusinesses(): Observable<IBusinessSummaryListItem[]> {
    return this.http.get<IBusinessSummaryListItem[]>(`${this.baseUrl}/businesses`);
  }

  getBusiness(id: string): Observable<IBusinessSummaryListItem> {
    return this.http.get<IBusinessSummaryListItem>(`${this.baseUrl}/businesses/${id}`);
  }

  getTransactions(
    businessId: string,
    year: number,
    month: number,
  ): Observable<ITransaction[]> {
    return this.http.get<ITransaction[]>(
      `${this.baseUrl}/businesses/${businessId}/transactions`,
      { params: { year, month } },
    );
  }

  createTransaction(
    businessId: string,
    body: ICreateTransactionRequest,
  ): Observable<ITransaction> {
    return this.http.post<ITransaction>(
      `${this.baseUrl}/businesses/${businessId}/transactions`,
      body,
    );
  }

  getSummary(
    businessId: string,
    year: number,
    month: number,
  ): Observable<IMonthlySummary> {
    return this.http.get<IMonthlySummary>(
      `${this.baseUrl}/businesses/${businessId}/summary`,
      { params: { year, month } },
    );
  }
}
