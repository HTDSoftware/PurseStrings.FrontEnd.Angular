import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EndSessionRequest, InteractionRequiredAuthError, RedirectRequest } from '@azure/msal-browser';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private msalService = inject(MsalService);
  private logger = inject(LoggingService);

  acquireToken(scopes: string[], tokenKey: string, expiryKey: string): Observable<void> {
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length !== 1) {
      this.logger.sendLog({
        level: 'ERR',
        component: 'auth.service.ts',
        message: 'Multiple accounts detected. Please ensure only one account is signed in.',
      });

      return throwError(() => new Error('Multiple accounts detected. Please ensure only one account is signed in.'));
    }

    const account = accounts[0];
    return this.msalService.acquireTokenSilent({ account, scopes }).pipe(
      tap((result: AuthenticationResult) => {
        const decodedToken: any = jwtDecode(result.accessToken);
        const expiryDate = new Date(decodedToken.exp * 1000);

        this.logger.sendLog({
          level: 'INF',
          component: 'auth.service.ts',
          message: `Token acquired for ${tokenKey}: ${result.accessToken}`,
        });

        localStorage.setItem(tokenKey, result.accessToken);
        localStorage.setItem(expiryKey, expiryDate.toString());
      }),
      map(() => void 0), // Transform the Observable<AuthenticationResult> to Observable<void>
      catchError((error) => {
        this.logger.sendLog({
          level: 'ERR',
          component: 'auth.service.ts',
          message: `Token acquisition failed for ${tokenKey}: ${error}`,
        });

        if (error instanceof InteractionRequiredAuthError) {
          this.msalService.acquireTokenRedirect({ scopes });
        }
        return throwError(() => new Error(error?.message || 'Token acquisition failed'));
      })
    );
  }

  loginRedirect(request?: RedirectRequest): void {
    this.msalService.loginRedirect(request);
  }

  logoutRedirect(postLogoutRedirectUri: string): void {
    const logoutRequest: EndSessionRequest = { postLogoutRedirectUri };
    this.msalService.logoutRedirect(logoutRequest);
  }
}
