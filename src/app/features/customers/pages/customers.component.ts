import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer, CustomerFormData } from '../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);

  isModalOpen = signal(false);
  searchQuery = signal('');
  toastMessage = signal<string | null>(null);

  customers = signal<Customer[]>([]);

  // Form State
  newCustomer = signal<CustomerFormData>({
    orderNo: '',
    mainSku: '',
    subSku: '',
    size: '',
    customerName: '',
    description: ''
  });

  filteredCustomers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.customers();
    if (!q) return list;
    return list.filter(c => {
      const cust = (c.customerName || c.customer || '').toLowerCase();
      const order = (c.orderNo || '').toLowerCase();
      const main = (c.mainSku || '').toLowerCase();
      const sub = (c.subSku || '').toLowerCase();
      return cust.includes(q) || order.includes(q) || main.includes(q) || sub.includes(q);
    });
  });

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers.set(data || []);
      },
      error: (err: unknown) => {
        console.error('Error fetching customers:', err);
        // Suppress error in UI initially if endpoint doesn't exist
      }
    });
  }

  openAddCustomerModal(): void {
    this.newCustomer.set({
      orderNo: '',
      mainSku: '',
      subSku: '',
      size: '',
      customerName: '',
      description: ''
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  submitNewCustomer(): void {
  const formData = this.newCustomer();

  // Validate required fields
  if (!formData.customerName?.trim() || !formData.orderNo?.trim() || !formData.mainSku?.trim()) {
    this.showToast('Please fill out all required fields');
    return;
  }

  // 🔴 FIX: Map customerName -> Customer to match backend CreateCustomerOrderDto
  const payload = {
    orderNo: formData.orderNo,
    mainSku: formData.mainSku,
    subSku: formData.subSku || null,
    size: formData.size || null,
    customer: formData.customerName, // 👈 Map customerName to 'customer'
    description: formData.description || null
  };

  this.customerService.createCustomer(payload).subscribe({
    next: () => {
      this.showToast(`Customer ${formData.customerName} added to Sales successfully`);
      this.closeModal();
      this.refreshData();
    },
    error: (err: unknown) => {
      console.error('Error adding customer:', err);
      this.showToast('Failed to add customer. Check console / network log.');
    }
  });
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
