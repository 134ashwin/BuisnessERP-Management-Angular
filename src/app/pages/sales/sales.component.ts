import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SaleOrder {
  orderId: string;
  buyerName: string;
  skuDetails: string;
  quantity: number;
  totalAmount: number;
  orderDate: string;
  status: 'Completed' | 'Pending' | 'Shipped';
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  // Client Demo Data
  salesOrders = signal<SaleOrder[]>([
    {
      orderId: 'ORD-2026-1001',
      buyerName: 'Ramesh Ji',
      skuDetails: 'SKU-L',
      quantity: 2,
      totalAmount: 2499.00,
      orderDate: '2026-09-08',
      status: 'Completed'
    },
    {
      orderId: 'ORD-2026-1002',
      buyerName: 'Manoj Kumar',
      skuDetails: 'SKU-D',
      quantity: 1,
      totalAmount: 65000.00,
      orderDate: '2026-09-09',
      status: 'Shipped'
    },
    {
      orderId: 'ORD-2026-1003',
      buyerName: 'Vikram Mehta',
      skuDetails: 'SKU-KEY',
      quantity: 3,
      totalAmount: 8999.00,
      orderDate: '2026-09-09',
      status: 'Pending'
    }
  ]);
}