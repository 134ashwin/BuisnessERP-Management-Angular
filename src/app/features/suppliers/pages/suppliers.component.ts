/**
 * PURPOSE / PROBLEM SOLVED: Serves as the main page controller managing vendor stats, product filtering/search, toast alerts, and modal dialog state.
 * NAVBAR PAGE & DATA DESTINATION: Directly powers the 'Suppliers' and 'Supplier Products' navbar menu items (/dashboard/suppliers and /dashboard/supplier-products).
 */

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../services/supplier.service';
import { AddProductModalComponent } from '../components/add-product-modal/add-product-modal.component';
import { SupplierProduct, SupplierInfo } from '../models/supplier-product.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, AddProductModalComponent],
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);

  isModalOpen = signal(false);
  selectedSupplierName = signal('');
  searchQuery = signal('');
  toastMessage = signal<string | null>(null);

  suppliers = signal<SupplierInfo[]>([]);
  products = signal<SupplierProduct[]>([]);

  totalSuppliersCount = computed(() => this.suppliers().length);
  activeSuppliersCount = computed(() => this.suppliers().filter(s => s.status === 'Active').length);
  totalProductsCount = computed(() => this.products().length);

  filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.products();
    if (!q) return list;
    return list.filter(p =>
      p.mainSku.toLowerCase().includes(q) ||
      p.supplierName.toLowerCase().includes(q) ||
      p.locationCode.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.status ? 'active' : 'inactive').includes(q) ||
      (p.Qty && p.Qty.toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.suppliers.set(this.supplierService.getSuppliers());
    this.products.set(this.supplierService.getProducts());
  }

  openAddProductModal(supplierName: string = ''): void {
    this.selectedSupplierName.set(supplierName);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onProductCreated(sku: string): void {
    this.refreshData();

    this.showToast(`Product created successfully (${sku})`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }
}
