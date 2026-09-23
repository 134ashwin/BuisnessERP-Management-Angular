import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. IMPORT RouterLinkActive HERE
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface MetricCard {
  title: string;
  value: number | string;
  colorClass: string;
  icon: string;
  progress?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. ADD RouterLinkActive TO THIS IMPORTS ARRAY
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  metrics = signal<MetricCard[]>([
    { title: 'USERS', value: 5, colorClass: 'border-blue', icon: 'fa-user' },
    { title: 'SUPPLIERS', value: 8, colorClass: 'border-green', icon: 'fa-users' },
    { title: 'PRODUCTS', value: 8781, colorClass: 'border-cyan', icon: 'fa-box', progress: 65 },
    { title: 'ORDERS', value: 18435, colorClass: 'border-amber', icon: 'fa-clipboard-list' }
  ]);

  navItems = signal([
    { label: 'Dashboard', icon: 'fa-tachometer-alt', route: '/dashboard' },
    { label: 'Users', icon: 'fa-user', route: '/dashboard/users' },
    { label: 'Brand', icon: 'fa-tag', route: '/dashboard/brand' },
    { label: 'Category', icon: 'fa-th-large', route: '/dashboard/category' },
    { label: 'Products', icon: 'fa-box', route: '/dashboard/products' },
    { label: 'Sales', icon: 'fa-chart-line', route: '/dashboard/sales' },
    { label: 'Customers', icon: 'fa-user-friends', route: '/dashboard/customers' },
    { label: 'Supplier Products', icon: 'fa-truck-loading', route: '/dashboard/supplier-products' },
    { label: 'Suppliers', icon: 'fa-store', route: '/dashboard/suppliers' },
    { label: 'Returns', icon: 'fa-undo', route: '/dashboard/returns' },
    { label: 'History', icon: 'fa-history', route: '/dashboard/history' },
    { label: 'Production Unit', icon: 'fa-history', route: '/dashboard/history' },
    { label: 'Raw Material', icon: 'fa-history', route: '/dashboard/raw_material' },
  ]);

  isSidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(val => !val);
  }
}