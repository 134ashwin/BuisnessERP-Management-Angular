import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { SalesOrder } from '../../models/sales.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sales-orders',//
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-orders.component.html',
  styleUrls: ['./sales-orders.component.scss']
})
export class SalesOrdersComponent implements OnInit {
  private salesService = inject(SalesService);

  allOrders = signal<SalesOrder[]>([]);
  isLoading = signal(false);
  isUploading = signal(false);
  toastMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  // Global search bar: searches across ANY field
  searchQuery = signal('');
  pageNumber = signal(1);
  pageSize = signal(15);

  // Live Multi-Field Filter across ALL fields:
  // Order Date, Order No, Main SKU, Sub SKU, Size, Customer, Description
  filteredOrders = computed(() => {
    const raw = this.allOrders();
    const q = this.searchQuery().trim().toLowerCase();

    if (!q) return raw;

    return raw.filter(o => {
      const orderDate = (o.orderDate || '').toLowerCase();
      const orderNo = (o.orderNo || '').toLowerCase();
      const mainSku = (o.mainSku || '').toLowerCase();
      const subSku = (o.subSku || '').toLowerCase();
      const size = (o.size || '').toLowerCase();
      const customer = (o.customer || '').toLowerCase();
      const desc = (o.description || '').toLowerCase();

      return (
        orderDate.includes(q) ||
        orderNo.includes(q) ||
        mainSku.includes(q) ||
        subSku.includes(q) ||
        size.includes(q) ||
        customer.includes(q) ||
        desc.includes(q)
      );
    });
  });

  totalCount = computed(() => this.filteredOrders().length);

  totalPages = computed(() => {
    const total = this.totalCount();
    const size = this.pageSize();
    return total > 0 ? Math.ceil(total / size) : 1;
  });

  pagedOrders = computed(() => {
    const filtered = this.filteredOrders();
    const start = (this.pageNumber() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading.set(true);
    this.salesService.getSalesOrders({ pageNumber: 1, pageSize: 50000 }).subscribe({
      next: (res: any) => {
        const records: SalesOrder[] = Array.isArray(res) ? res : (res?.items || []);
        this.allOrders.set(records);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load sales orders:', err);
        this.showToast('Failed to load sales orders from server.', 'error');
        this.allOrders.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.pageNumber.set(1);
  }

  onReset(): void {
    this.searchQuery.set('');
    this.pageNumber.set(1);
  }

  // IMPORT EXCEL FEATURE
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.isUploading.set(true);

    this.salesService.importExcel(file).subscribe({
      next: (res: { message: string }) => {
        this.isUploading.set(false);
        input.value = '';
        this.showToast(res.message || 'Excel file imported successfully!', 'success');
        this.fetchOrders();
      },
      error: (err: unknown) => {
        this.isUploading.set(false);
        input.value = '';
        console.error('Upload error:', err);
        this.showToast('Failed to import Excel file. Please check file format.', 'error');
      }
    });
  }

  // EXPORT EXCEL FEATURE
  exportExcel(): void {
    const records = this.filteredOrders();
    if (records.length === 0) {
      this.showToast('No records available to export.', 'error');
      return;
    }

    // Map exact fields to Excel columns:
    // Order Date, Order No, Main SKU, Sub SKU, Size, Customer, Description
    const exportData = records.map(item => ({
      'Order Date': item.orderDate || '',
      'Order No': item.orderNo || '',
      'Main SKU': item.mainSku || '',
      'Sub SKU': item.subSku || '',
      'Size': item.size || '',
      'Customer': item.customer || '',
      'Description': item.description || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Apply neat column widths
    worksheet['!cols'] = [
      { wch: 14 }, // Order Date
      { wch: 18 }, // Order No
      { wch: 16 }, // Main SKU
      { wch: 16 }, // Sub SKU
      { wch: 10 }, // Size
      { wch: 24 }, // Customer
      { wch: 30 }  // Description
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Orders');

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Sales_Orders_${dateStr}.xlsx`);
    this.showToast(`Exported ${records.length} sales orders to Excel!`, 'success');
  }

  nextPage(): void {
    if (this.pageNumber() < this.totalPages()) {
      this.pageNumber.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.pageNumber() > 1) {
      this.pageNumber.update(p => p - 1);
    }
  }

  showToast(text: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage.set({ text, type });
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }
}
