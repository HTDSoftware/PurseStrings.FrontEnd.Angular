import { Routes } from '@angular/router';
import { LoginDialogComponent } from '../../onlinebanking/components/login-dialog.component';
import { MsalGuard } from '@azure/msal-angular';

export const onlineBankingRoutes: Routes = [
  { path: 'components/onlinebanking/onlinebanking-login', component: LoginDialogComponent, canActivate: [MsalGuard] },
];
