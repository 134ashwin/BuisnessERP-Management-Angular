import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../services/sales.service';
import { SalesCustomer } from '../models/sales.model';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  private salesService = inject(SalesService);

  // 2 main view tabs: "B2B Sales" and "B2C Sales"
  activeTab = signal<'B2B' | 'B2C'>('B2B');

  // Customer Data Sources for B2B and B2C
  b2bCustomers = signal<SalesCustomer[]>([]);
  b2cCustomers = signal<SalesCustomer[]>([]);

  isLoading = signal(false);
  isUploading = signal(false);

  // Filter & Pagination Signals
  searchQuery = signal('');
  pageNumber = signal(1);
  pageSize = signal(10);

  // Active dataset based on selected tab
  currentTabCustomers = computed(() => {
    return this.activeTab() === 'B2B' ? this.b2bCustomers() : this.b2cCustomers();
  });

  // 1. LIVE INSTANT FILTERING across Customer Name, Mobile, Email, GST Number
  filteredCustomers = computed(() => {
    const rawList = this.currentTabCustomers();
    const q = this.searchQuery().trim().toLowerCase();

    if (!q) return rawList;

    return rawList.filter(item => {
      const name = (item.name || item.customerName || '').toLowerCase();
      const mobile = (item.mobileNumber || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const gst = (item.gstNumber || '').toLowerCase();

      return name.includes(q) || mobile.includes(q) || email.includes(q) || gst.includes(q);
    });
  });

  // 2. COMPUTED PAGINATION METRICS
  totalCount = computed(() => this.filteredCustomers().length);

  totalPages = computed(() => {
    const total = this.totalCount();
    const size = this.pageSize();
    return total > 0 ? Math.ceil(total / size) : 1;
  });

  // 3. CURRENT PAGE SLICE FOR HTML TABLE
  pagedCustomers = computed(() => {
    const filtered = this.filteredCustomers();
    const start = (this.pageNumber() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  ngOnInit(): void {
    this.fetchData();
  }

  // Switch between B2B Sales and B2C Sales tabs
  switchTab(tab: 'B2B' | 'B2C'): void {
    this.activeTab.set(tab);
    this.pageNumber.set(1);
    this.searchQuery.set('');
  }

  // Fetch both B2B and B2C sales customers
  fetchData(): void {
    this.isLoading.set(true);

    this.salesService.getB2BCustomers().subscribe({
      next: (b2b) => {
        this.b2bCustomers.set(b2b || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load B2B customers:', err);
        this.b2bCustomers.set([]);
        this.isLoading.set(false);
      }
    });

    this.salesService.getB2CCustomers().subscribe({
      next: (b2c) => {
        this.b2cCustomers.set(b2c || []);
      },
      error: (err) => {
        console.error('Failed to load B2C customers:', err);
        this.b2cCustomers.set([]);
      }
    });
  }

  updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.pageNumber.set(1);
  }

  onReset(): void {
    this.searchQuery.set('');
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

  // Display helper for GST: if missing, renders 'No GST Number'
  formatGst(gst?: string | null): string {
    if (!gst || gst.trim() === '' || gst.toLowerCase() === 'no gst number') {
      return 'No GST Number';
    }
    return gst;
  }
}