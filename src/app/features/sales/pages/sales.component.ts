import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../services/sales.service';
import { SalesOrder } from '../models/sales.model';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  private salesService = inject(SalesService);

  // Master Data Source (Stored once from API)
  allSalesOrders = signal<SalesOrder[]>([]);
  isLoading = signal(false);
  isUploading = signal(false);

  // Filter & Pagination Signals
  searchOrderNo = signal('');
  searchDate = signal('');
  pageNumber = signal(1);
  pageSize = signal(10);

  // 1. LIVE DERIVED FILTERING (Fires instantly on search signals change)
  filteredSalesOrders = computed(() => {
    const rawOrders = this.allSalesOrders();
    const orderNoQuery = this.searchOrderNo().trim().toLowerCase();
    const dateQuery = this.searchDate().trim();

    return rawOrders.filter(order => {
      const matchesOrderNo = !orderNoQuery || 
        order.orderNo?.toLowerCase().includes(orderNoQuery);

      const matchesDate = !dateQuery || 
        order.orderDate?.startsWith(dateQuery);

      return matchesOrderNo && matchesDate;
    });
  });

  // 2. COMPUTED PAGINATION METRICS
  totalCount = computed(() => this.filteredSalesOrders().length);

  totalPages = computed(() => {
    const total = this.totalCount();
    const size = this.pageSize();
    return total > 0 ? Math.ceil(total / size) : 1;
  });

  // 3. CURRENT PAGE SLICE FOR HTML TABLE
  pagedSalesOrders = computed(() => {
    const filtered = this.filteredSalesOrders();
    const start = (this.pageNumber() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  ngOnInit(): void {
    this.fetchAllSales();
  }

  // Fetch all 17,000 rows from backend ONCE
  fetchAllSales(): void {
    this.isLoading.set(true);

    // Send pageNumber: 1, pageSize: 50000 or fetch all array directly
    this.salesService.getSalesOrders({ pageNumber: 1, pageSize: 50000 }).subscribe({
      next: (res: any) => {
        const records: SalesOrder[] = Array.isArray(res) ? res : (res?.items || []);
        this.allSalesOrders.set(records);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load sales orders:', err);
        this.allSalesOrders.set([]);
        this.isLoading.set(false);
      }
    });
  }

  // Live Instant Search Trigger
  updateOrderNo(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchOrderNo.set(value);
    this.pageNumber.set(1); // Reset to page 1 on filter change
  }

  updateDate(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchDate.set(value);
    this.pageNumber.set(1);
  }

  onReset(): void {
    this.searchOrderNo.set('');
    this.searchDate.set('');
    this.pageNumber.set(1);
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.isUploading.set(true);

    this.salesService.importExcel(file).subscribe({
      next: (res) => {
        alert(res.message || 'Excel imported successfully!');
        this.isUploading.set(false);
        input.value = '';
        this.fetchAllSales(); // Refresh local cache after file upload
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('Upload failed!');
        this.isUploading.set(false);
        input.value = '';
      }
    });
  }
}