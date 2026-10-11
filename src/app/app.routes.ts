import { Routes } from '@angular/router';
import { authGuard } from '../../src/app/core/guards/auth.guard'; // 1. Import your authGuard

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
    canActivate: [authGuard], // 2. Add AuthGuard here to protect Dashboard & all sub-routes!
    children:[
      {
        path: 'sales',
        loadComponent: () => import('./features/sales/pages/sales.component').then(m => m.SalesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'sales-orders',
        loadComponent: () => import('./features/sales/pages/sales-orders/sales-orders.component').then(m => m.SalesOrdersComponent),
        canActivate: [authGuard]
      },
      {
         path: 'products',
        loadComponent: () => import('./features/products/pages/products.component').then(m => m.ProductsComponent)
      },
      // {
      //   path: 'suppliers',
      //   loadComponent: () => import('./features/suppliers/pages/suppliers.component').then(m => m.SuppliersComponent)
      // },
      {
        path: 'supplier-products',
        loadComponent: () => import('./features/suppliers/pages/suppliers.component').then(m => m.SuppliersComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/pages/customers.component').then(m => m.CustomersComponent)
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'auth/login' 
  }
];