import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  protected apiEndpoint = environment.apiEndpoint;

  constructor(protected http: HttpClient) { }

  protected get<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.apiEndpoint}${path}`, { headers });
  }

  protected post<T>(
    path: string,
    body: any,
    headers?: HttpHeaders,
    observe: 'body' | 'response' = 'body'
  ): Observable<T> {
    return this.http.post<T>(`${this.apiEndpoint}${path}`, body, {
      headers,
      observe: observe as 'body',
    });
  }
}
