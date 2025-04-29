import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private logger = inject(LoggingService);
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenKey = localStorage.getItem('combined_access_token');
    const tokenExpiry = localStorage.getItem('combined_access_token_expiry');

    if (tokenKey && tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      const currentDate = new Date();

      if (currentDate > expiryDate) {
        this.logger.sendLog({
          level: 'INF',
          component: 'auth.interceptor.ts',
          message: 'Token expired, acquiring new token',
        });

        return this.authService.acquireToken(
          [
            'openid',
            'profile',
            'https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.read',
            'https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.write',
            'https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.readwrite',
          ],
          'combined_access_token',
          'combined_access_token_expiry'
        ).pipe(
          switchMap(() => {
            const newToken = localStorage.getItem('combined_access_token');
            const cloned = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`),
            });
            return next.handle(cloned);
          }),
          catchError((error) => {
            this.logger.sendLog({
              level: 'ERR',
              component: 'auth.interceptor.ts',
              message: 'Token acquisition failed',
            });
            return throwError(() => new Error('Token acquisition failed'));
          })
        );
      } else {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${tokenKey}`),
        });

        return next.handle(cloned).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
              this.logger.sendLog({
                level: 'ERR',
                component: 'auth.interceptor.ts',
                message: 'Authorization error, ACCESS DENIED',
              });
            }
            return throwError(() => new Error(error.message || 'Server error'));
          })
        );
      }
    } else {
      return next.handle(req);
    }
  }
}
