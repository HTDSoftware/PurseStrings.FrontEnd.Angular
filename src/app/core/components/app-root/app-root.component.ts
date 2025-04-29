import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Router, RouterModule } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LoggingService } from '../../services/logging.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterModule]
})
export class AppRootComponent implements OnInit, OnDestroy {
  title = 'PurseStrings-FrontEnd-Angular';
  loginDisplay = false;
  private readonly destroying$ = new Subject<void>();

  private authService = inject(AuthService);
  private msalService = inject(MsalService);
  private broadcastService = inject(MsalBroadcastService);
  private snackBar = inject(MatSnackBar);
  private logger = inject(LoggingService);
  private router = inject(Router);

  ngOnInit(): void {
    this.subscribeToLoginEvents();
    this.subscribeToInteractionStatus();
  }

  private subscribeToLoginEvents(): void {
    this.broadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe((result: EventMessage) => {
        this.logger.sendLog({
          level: 'INF',
          component: 'app-root.component.ts',
          message: 'LOGIN_SUCCESS event: ' + JSON.stringify(result),
        });
        this.setLoginDisplay();
        this.navigateBasedOnLoginStatus();
      });
  }

  private subscribeToInteractionStatus(): void {
    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.navigateBasedOnLoginStatus();
        if (this.loginDisplay) {
          this.acquireAllTokens();
        }
      });
  }

  private acquireAllTokens(): void {
    this.authService
      .acquireToken(
        [
          'openid',
          'profile',
          'https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.read',
          'https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.write',
          'https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.readwrite',
        ],
        'combined_access_token',
        'combined_access_token_expiry'
      )
      .pipe(
        catchError((error) => {
          this.logger.sendLog({
            level: 'ERR',
            component: 'app-root.component.ts',
            message: 'Token acquisition failed'
          });
          this.showMessage('Error', 'Token acquisition failed');
          return throwError(() => new Error('Token acquisition failed'));
        })
      )
      .subscribe(() => {
        this.showMessage('Success', 'API Token acquisition succeeded');
      });
  }

  private showMessage(summary: string, detail: string): void {
    this.snackBar.open(`${summary}: ${detail}`, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  login(): void {
    this.authService.loginRedirect();
  }

  logout(): void {
    this.authService.logoutRedirect('http://localhost:4200');
  }

  private setLoginDisplay(): void {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  private navigateBasedOnLoginStatus(): void {
    if (this.loginDisplay) {
      this.router.navigate(['components/accounts/accountgroups/accountgroup-list']);
    }
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}
