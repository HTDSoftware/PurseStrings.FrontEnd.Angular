import { provideRouter, Routes } from '@angular/router';
import { accountsRoutes } from '../../features/accounts/routes/accounts.routes';
import { onlineBankingRoutes } from '../../features/onlinebanking/routes/onlinebanking.routes';
import { profileRoutes } from '../../features/profile/routes/profile.routes';

export const appRoutes: Routes = [
  ...accountsRoutes,
  ...onlineBankingRoutes,
  ...profileRoutes,
  { path: '**', redirectTo: 'components/accounts/accountgroups/accountgroup-list' }, // Fallback route
];

export const appRoutingProviders = [provideRouter(appRoutes)];
