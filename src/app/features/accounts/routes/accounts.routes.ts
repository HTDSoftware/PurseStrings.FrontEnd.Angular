import { Routes } from '@angular/router';
import { AccountGroupListComponent } from '../groups/account-group-list.component';
import { AccountEventComponent } from '../events/account-event.component';
import { AccountEventListComponent } from '../events/account-event-list.component';
import { TransactionComponent } from '../events/transaction.component';
import { MsalGuard } from '@azure/msal-angular';

export const accountsRoutes: Routes = [
  { path: 'components/accounts/accountgroups/accountgroup-list', component: AccountGroupListComponent, canActivate: [MsalGuard] },
  { path: 'components/accounts/accountevents/accountevent', component: AccountEventComponent, canActivate: [MsalGuard] },
  { path: 'components/accounts/accountevents/accountevent-list', component: AccountEventListComponent, canActivate: [MsalGuard] },
  { path: 'components/accounts/accountevents/transaction', component: TransactionComponent, canActivate: [MsalGuard] },
];
