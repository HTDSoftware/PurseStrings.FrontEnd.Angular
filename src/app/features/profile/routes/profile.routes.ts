import { Routes } from '@angular/router';
import { ProfileComponent } from '../components/profile.component';
import { MsalGuard } from '@azure/msal-angular';

export const profileRoutes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard] },
];
