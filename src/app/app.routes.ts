import { Routes } from '@angular/router';

/**
 * Application Routes
 * Main routing configuration using lazy loading for feature domains
 */
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'auth/login', 
    pathMatch: 'full' 
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.route').then(m => m.auth_routes)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children:[
      {
        path: 'sales',
        loadComponent: () => import('./pages/sales/sales.component').then(m => m.SalesComponent)
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'auth/login' 
  }
];