import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountService } from '../services/account.service';
import { OnlineBankingService } from '../../onlinebanking/services/onlinebanking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoggingService } from '../../../core/services/logging.service';
import { FileUploadComponent } from '../../../shared/components/file-upload.component';
import { LoginDialogComponent } from '../../onlinebanking/components/login-dialog.component';
import { AccountEventComponent } from '../events/account-event.component';
import { formatDate, formatValue } from '../../../core/utilities/utilities';
import { IAccount } from '../models/account.model';

@Component({
  selector: 'app-account-group-list',
  templateUrl: './account-group-list.component.html',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatTooltipModule],
})
export class AccountGroupListComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  private onlineBankingService = inject(OnlineBankingService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private logger = inject(LoggingService);

  private destroyed$ = new Subject<void>();

  formatDate = formatDate;
  formatValue = formatValue;
  groupedAccounts: any;
  loading = true;
  displayedColumns: string[] = [
    'bank',
    'account',
    'calculatedBalance',
    'onlineBankingBalance',
    'availableBalance',
    'lastEvent',
    'actions',
  ];
  dataSource: any[] = [];

  ngOnInit(): void {
    this.logger.sendLog({
      level: 'DBG',
      component: 'account-group-list.component.ts',
      message: 'Opening AccountGroupListComponent'
    });

    this.accountService
      .getGroupedAccounts()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {
          this.logger.sendLog({
            level: 'DBG',
            component: 'account-group-list.component.ts',
            message: 'getGroupedAccounts response:' + response
          });

          this.groupedAccounts = { ...response };

          this.dataSource = [
            ...this.groupedAccounts.AccountsInCredit.map((account: IAccount) => ({
              type: 'account',
              label: 'Credit Account',
              ...account,
            })),
            { type: 'subtotal', label: 'Accounts in Credit', ...this.groupedAccounts.AccountsInCreditSubtotals },
            this.createEmptyRecord(),
            ...this.groupedAccounts.AccountsInDebit.map((account: IAccount) => ({
              type: 'account',
              label: 'Debit Account',
              ...account,
            })),
            { type: 'subtotal', label: 'Accounts in Debit', ...this.groupedAccounts.AccountsInDebitSubtotals },
            this.createEmptyRecord(),
            { type: 'total', label: 'Nett Accounts Balance', ...this.groupedAccounts.GrandTotals },
          ];

          this.loading = false;
        },
        error: (error) => {
          this.notificationService.showErrorToast('An error occurred while fetching grouped accounts: ' + error.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  viewAccountEvents(account: any): void {
    this.router.navigate(['/features/accounts/events/account-event-list'], {
      queryParams: {
        accountName: account.AccountName,
        fromDate: '2023-01-01',
        toDate: '2023-01-31',
        pageSize: '30',
      },
    });
  }

  loadAccountEvents(account: any): void {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
    });

    dialogRef.componentInstance.fileLoaded.subscribe(() => {
      this.dialog.open(AccountEventComponent, {
        width: '600px',
        data: { account },
      });
    });
  }

  downloadOnlineEvents(account: any): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      panelClass: 'custom-dialog-container',
      hasBackdrop: false,
      data: { bankname: account.BankName, username: account.OnlineBankingUsername },
    });

    dialogRef.afterClosed().subscribe({
      next: (dialogResult) => {
        if (dialogResult && dialogResult.username && dialogResult.password) {
          this.onlineBankingService
            .downloadOnlineEvents(account.BankName, account.OnlineBankingUsername, dialogResult.password)
            .subscribe({
              next: (response) => {
                this.logger.sendLog({
                  level: 'INF',
                  component: 'account-group-list.component.ts',
                  message: 'Online events downloaded successfully'
                });
              },
              error: (err) => {
                this.logger.sendLog({
                  level: 'ERR',
                  component: 'account-group-list.component.ts',
                  message: 'Error downloading online events:' + err
                });
              },
            });
        } else {
          this.logger.sendLog({
            level: 'INF',
            component: 'account-group-list.component.ts',
            message: 'User did not provide Username and/or Password'
          });
        }
      },
    });
  }

  private createEmptyRecord(): any {
    return {
      bank: '',
      account: '',
      calculatedBalance: '',
      onlineBankingBalance: '',
      availableBalance: '',
      lastEvent: '',
      actions: '',
      type: 'empty',
      label: '',
    };
  }
}
