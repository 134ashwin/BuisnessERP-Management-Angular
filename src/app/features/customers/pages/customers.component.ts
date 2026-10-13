import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer, CustomerFormData, CustomerCreateDto } from '../models/customer.model';

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
  toastMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);
  isLoading = signal(false);
  isSubmitting = signal(false);

  customers = signal<Customer[]>([]);

  // Customer Form Fields:
  // 1. Customer Name (Required)
  // 2. Mobile Number (Required)
  // 3. Address (Required)
  // 4. Email ID (Optional)
  // 5. GST Number (Optional)
  // 6. Description (Optional)
  newCustomer = signal<CustomerFormData>({
    customerName: '',
    mobileNumber: '',
    email: '',
    gstNumber: '',
    address: '',
    description: ''
  });

  formErrors = signal<{
    customerName?: string;
    mobileNumber?: string;
    address?: string;
    email?: string;
    gstNumber?: string;
    description?: string;
  }>({});

  filteredCustomers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.customers();
    if (!q) return list;
    return list.filter(c => {
      const name = (c.name || c.customerName || '').toLowerCase();
      const mobile = (c.mobileNumber || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const gst = (c.gstNumber || '').toLowerCase();
      const addr = (c.address || '').toLowerCase();
      return name.includes(q) || mobile.includes(q) || email.includes(q) || gst.includes(q) || addr.includes(q);
    });
  });

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.isLoading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers.set(data || []);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Error fetching customers:', err);
        this.isLoading.set(false);
      }
    });
  }

  openAddCustomerModal(): void {
    this.newCustomer.set({
      customerName: '',
      mobileNumber: '',
      email: '',
      gstNumber: '',
      address: '',
      description: ''
    });
    this.formErrors.set({});
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.formErrors.set({});
  }

  updateField<K extends keyof CustomerFormData>(field: K, value: string): void {
    this.newCustomer.update(prev => ({ ...prev, [field]: value }));
    // Clear field-specific error on user input
    if (this.formErrors()[field]) {
      this.formErrors.update(errs => ({ ...errs, [field]: undefined }));
    }
  }

  validateForm(): boolean {
    const data = this.newCustomer();
    const errors: {
      customerName?: string;
      mobileNumber?: string;
      Address?: string;
      email?: string;
      gstNumber?: string;
      description?: string;
    } = {};

    // 1. Customer Name (Required)
    if (!data.customerName || !data.customerName.trim()) {
      errors.customerName = 'Customer Name is required.';
    } else if (data.customerName.trim().length < 2) {
      errors.customerName = 'Customer Name must be at least 2 characters.';
    }

    // 2. Mobile Number (Required)
    const mobileDigits = (data.mobileNumber || '').replace(/\D/g, '');
    if (!data.mobileNumber || !data.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required.';
    } else if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      errors.mobileNumber = 'Please enter a valid mobile number (10-15 digits).';
    }

    // 3. Address (Required)
    if (!data.address || !data.address.trim()) {
      errors.Address = 'Address is required.';
    } else if (data.address.trim().length < 5) {
      errors.Address = 'Address must be at least 5 characters long.';
    }

    // 4. Email ID (Optional)
    if (data.email && data.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    // 5. GST Number (Optional)
    if (data.gstNumber && data.gstNumber.trim()) {
      const gstVal = data.gstNumber.trim();
      if (gstVal.length < 5 || gstVal.length > 20) {
        errors.gstNumber = 'GST Number must be between 5 and 20 characters.';
      }
    }

    // 6. Description (Optional)
    if (data.description && data.description.trim()) {
      if (data.description.trim().length > 500) {
        errors.description = 'Description cannot exceed 500 characters.';
      }
    }

    this.formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  submitNewCustomer(): void {
    if (!this.validateForm()) {
      this.showToast('Please correct the validation errors in the form.', 'error');
      return;
    }

    const formData = this.newCustomer();
    const payload: CustomerCreateDto = {
      name: formData.customerName.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      email: formData.email?.trim() ? formData.email.trim() : null,
      gstNumber: formData.gstNumber?.trim() ? formData.gstNumber.trim() : null,
      address: formData.address.trim(),
      description: formData.description?.trim() ? formData.description.trim() : null
    };

    this.isSubmitting.set(true);
    this.customerService.createCustomer(payload).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        const destination = payload.gstNumber ? 'B2B Sales' : 'B2C Sales';
        this.showToast(`Customer "${created.name}" created and routed to ${destination}!`, 'success');
        this.closeModal();
        this.refreshData();
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        console.error('Error creating customer:', err);
        this.showToast('Failed to create customer. Please check server logs.', 'error');
      }
    });
  }

  showToast(text: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage.set({ text, type });
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }
}