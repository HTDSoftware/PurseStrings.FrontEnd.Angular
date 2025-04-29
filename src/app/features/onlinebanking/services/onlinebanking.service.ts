import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { LoggingService } from '../../../core/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class OnlineBankingService {
  private readonly apiBaseUrl = '/api/OnlineBanking';

  constructor(private http: HttpClient, private logger: LoggingService) { }

  downloadOnlineEvents(
    bankname: string,
    username: string,
    password: string
  ): Observable<{ resultCode: number; resultMessage: string }> {
    const requestBody = { bankname, username, password };
    const endpoint = `${this.apiBaseUrl}/DownloadOnlineEvents`;

    return this.http.post<any>(endpoint, requestBody).pipe(
      map((response) => {
        if (response?.resultCode !== undefined && response?.resultMessage !== undefined) {
          return { resultCode: response.resultCode, resultMessage: response.resultMessage };
        } else {
          return { resultCode: -99, resultMessage: 'Unexpected response format' };
        }
      }),
      catchError((error) => {
        this.logger.sendLog({
          level: 'ERR',
          component: 'onlinebanking.service.ts',
          message: `Error: ${JSON.stringify(error)}`
        });

        return of({ resultCode: -99, resultMessage: 'Unhandled error downloading online events' });
      })
    );
  }
}
