import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);

  // Master signals
  allProducts = signal<Product[]>([]);
  searchQuery = signal<string>('');
  statusFilter = signal<string>('ALL');
  isLoading = signal<boolean>(false);
  isAllExpanded = signal<boolean>(false);
  copiedSku = signal<string | null>(null);

  // Computed metrics
  totalProductsCount = computed(() => this.allProducts().length);
  
  totalSubSkusCount = computed(() => 
    this.allProducts().reduce((acc, p) => acc + (p.subSkus?.length || 0), 0)
  );

  inStockCount = computed(() =>
    this.allProducts().filter(p => {
      const s = p.status?.toLowerCase();
      return s === 'in stock' || s === 'active';
    }).length
  );

  lowStockCount = computed(() =>
    this.allProducts().filter(p => p.status?.toLowerCase() === 'low stock').length
  );

  /**
   * Live client-side computed filtering across all 8 required normalized fields:
   * - Date_d_m_y
   * - mainSku
   * - SubSku (inside child variants)
   * - Supplier (lifted to root)
   * - Size (inside child variants)
   * - Location (lifted to root)
   * - Description
   * - Status
   */
  filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    let products = this.allProducts();

    // 1. Status Filter
    if (status !== 'ALL') {
      products = products.filter(p => p.status?.toLowerCase() === status.toLowerCase());
    }

    // 2. Multi-field Deep Search
    if (!query) return products;

    return products.filter(p => {
      // Root Entity normalized fields
      const matchesMainSku = p.mainSku?.toLowerCase().includes(query);
      const matchesSupplier = p.supplier?.toLowerCase().includes(query);
      const matchesLocation = p.location?.toLowerCase().includes(query);
      const matchesDescription = p.description?.toLowerCase().includes(query);
      const matchesStatus = p.status?.toLowerCase().includes(query);
      const matchesDate = p.Date_d_m_y?.toLowerCase().includes(query);

      // Child SubSku variant fields (SubSku, Size, Description, Status)
      const matchesSubSkus = p.subSkus?.some(sub =>
        sub.subSku?.toLowerCase().includes(query) ||
        sub.size?.toLowerCase().includes(query) ||
        sub.description?.toLowerCase().includes(query) ||
        sub.status?.toLowerCase().includes(query)
      );

      return (
        matchesMainSku ||
        matchesSupplier ||
        matchesLocation ||
        matchesDescription ||
        matchesStatus ||
        matchesDate ||
        matchesSubSkus
      );
    });
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts(this.searchQuery()).subscribe({
      next: (data) => {
        // Retain user's current expansion state on reload
        const currentExpansions = new Map(this.allProducts().map(p => [p.id, p.isExpanded]));
        const normalized = data.map(p => ({
          ...p,
          isExpanded: currentExpansions.get(p.id) ?? false
        }));
        this.allProducts.set(normalized);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleRow(productId: number, event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        return;
      }
    }
    this.allProducts.update(products =>
      products.map(p => (p.id === productId ? { ...p, isExpanded: !p.isExpanded } : p))
    );
  }

  toggleExpandAll(): void {
    const nextState = !this.isAllExpanded();
    this.isAllExpanded.set(nextState);
    this.allProducts.update(products =>
      products.map(p => ({ ...p, isExpanded: nextState }))
    );
  }

  updateSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  setStatusFilter(status: string): void {
    this.statusFilter.set(status);
  }

  copySku(sku: string, event: Event): void {
    event.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(sku).then(() => {
        this.copiedSku.set(sku);
        setTimeout(() => this.copiedSku.set(null), 1800);
      });
    }
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('in stock') || s === 'active') return 'status-in-stock';
    if (s.includes('low')) return 'status-low-stock';
    if (s.includes('out')) return 'status-out-stock';
    return 'status-neutral';
  }
}