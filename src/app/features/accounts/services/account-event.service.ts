import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IPredictionResponse } from '../models/ai.model';
import { LoggingService } from '../../../core/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class AccountEventService {
  private http = inject(HttpClient);
  private logger = inject(LoggingService);

  private readonly aiBaseUrl = '/predictItemName';
  private readonly apiBaseUrl = '/api/AccountEvents';

  predictItemName(accountName: string, eventDescription: string): Observable<IPredictionResponse> {
    const body = JSON.stringify({
      AccountName: accountName,
      EventDescription: eventDescription,
    });

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<IPredictionResponse>(this.aiBaseUrl, body, { headers }).pipe(
      catchError(this.handleError<IPredictionResponse>('predictItemName', { predictedItemName: '', confidence: 666 }))
    );
  }

  createAccountEvent(
    account: string,
    eventDate: Date,
    description: string,
    amount: number,
    category: string
  ): Observable<number> {
    const body = JSON.stringify({
      account: account,
      eventDate: eventDate,
      description: description,
      amount: amount,
      category: category
    });

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<HttpResponse<any>>(`${this.apiBaseUrl}/CreateAccountEvent`, body, { headers, observe: 'response' })
      .pipe(
        map((response) => response.status as number),
        catchError(this.handleError<number>('createAccountEvent', 0))
      );
  }

  isAIAvailable(): Observable<boolean> {
    return this.predictItemName('', '').pipe(
      catchError(() => of({ predicted_item_name: '', confidence: 666 })),
      map((response) => response.confidence !== 666)
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      const errorDetails = {
        operation,
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        url: error.url,
      };

      this.logger.sendLog({
        level: 'ERR',
        component: 'account-event.service.ts',
        message: JSON.stringify(errorDetails)
      });

      return of(result as T);
    };
  }
}
