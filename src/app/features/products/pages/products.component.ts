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

  // Signals
  allProducts = signal<Product[]>([]);
  searchQuery = signal('');
  isLoading = signal(false);

  // Live client-side computed search across SKU and Main SKU
  filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.allProducts();

    return this.allProducts().filter(p => 
      p.sku.toLowerCase().includes(query) || 
      p.mainSku.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        // Map data and add row expansion flag
        const mapped = data.map(p => ({ ...p, isExpanded: false }));
        this.allProducts.set(mapped);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleRow(productId: number): void {
    this.allProducts.update(products => 
      products.map(p => p.id === productId ? { ...p, isExpanded: !p.isExpanded } : p)
    );
  }

  updateSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }
}