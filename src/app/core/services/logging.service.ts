import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LogEntry } from '../models/log-entry.model'
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LoggingService extends BaseService {
  private apiBaseUrl = `${environment.apiEndpoint}/api/Log`;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Sends a log entry to the server.
   * @param logEntry The log entry to send.
   * @returns An Observable of the HTTP status code.
   */
  sendLog(logEntry: LogEntry): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.post<{ status: number }>(
      `${this.apiBaseUrl}/RecordEventLog`,
      logEntry,
      headers,
      'response'
    ).pipe(
      map((response: any) => response.status), // Access the status property
      catchError(this.handleError<number>('sendLog', 0))
    );
  }

  /**
   * Handles errors from HTTP requests.
   * @param operation The name of the operation that failed.
   * @param result The default value to return in case of an error.
   * @returns An Observable of the default value.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
