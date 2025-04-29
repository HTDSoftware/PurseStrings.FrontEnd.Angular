import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IPaginatedAccountEvents } from '../models/account-event.models';
import { IGroupedAccountDTO } from '../models/account-group.model';
import { LoggingService } from '../../../core/services/logging.service';
import { LogEntry } from '../../../core/models/log-entry.model'; // Import LogEntry model

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private logger = inject(LoggingService);

  private readonly apiBaseUrl = '/api/Accounts';

  getGroupedAccounts(): Observable<IGroupedAccountDTO> {
    const endpoint = `${this.apiBaseUrl}/GetGroupedAccounts`;

    return this.http.get<IGroupedAccountDTO>(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logDetailedError(error);
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }

  getEventsPaginated(
    accountName: string,
    fromDate: Date,
    toDate: Date,
    pageIndex: number = 0,
    pageSize: number = 30
  ): Observable<IPaginatedAccountEvents> {
    const endpoint = `${this.apiBaseUrl}/GetAccountEventsPaginated`;
    const params = new URLSearchParams({
      accountName: encodeURIComponent(accountName),
      fromDate: encodeURIComponent(fromDate.toISOString()),
      toDate: encodeURIComponent(toDate.toISOString()),
      pageIndex: encodeURIComponent(pageIndex.toString()),
      pageSize: encodeURIComponent(pageSize.toString()),
    });

    return this.http.get<IPaginatedAccountEvents>(`${endpoint}?${params}`).pipe(
      map((response) => ({
        events: response.events,
        totalEvents: response.totalEvents,
      })),
      catchError((error: HttpErrorResponse) => {
        this.logDetailedError(error);
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }

  private logDetailedError(error: HttpErrorResponse): void {
    const logEntry: LogEntry = {
      level: 'ERR',
      component: 'account.service.ts',
      message: JSON.stringify({
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url,
        headers: error.headers,
      }),
    };

    this.logger.sendLog(logEntry);  }
}
