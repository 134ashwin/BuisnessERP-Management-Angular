import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { AuthGuard } from './core/guards/auth.guard';
import { auth_routes } from './features/auth/auth.route';

/**
 * Application Routes
 * Main routing configuration - feature routes should be lazy-loaded
 */
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.route')
        .then(m => m.auth_routes)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
];
