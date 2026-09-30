/**
 * Add Products Work Is done 
 * PURPOSE / PROBLEM SOLVED: Provides a Netflix-styled modal component with client-side validation, ESC/backdrop close handlers, and API submission trigger for adding new products.
 * NAVBAR PAGE & DATA DESTINATION: Opens on the 'Suppliers' and 'Supplier Products' navbar pages; submits form data to SupplierService.
 */

import { Component, EventEmitter, HostListener, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);

  @Input() isOpen = false;
  @Input() initialSupplierName = '';
  @Output() close = new EventEmitter<void>();
  @Output() productCreated = new EventEmitter<string>();

  productForm!: FormGroup;
  isSubmitting = signal(false);
  maxDescriptionLength = 250;

  supplierOptions = signal<string[]>([
    'Apex Global Logistics',
    'Nordic Fabricators GmbH',
    'Zenith Tech Hardware Ltd',
    'Solaria Optics Corp',
    'Titan Industrial Systems',
    'Vanguard Supply Chain Co.',
    'Apex Industrial Materials'
  ]);

  filteredSuppliers = signal<string[]>([]);
  isSupplierDropdownOpen = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.filteredSuppliers.set(this.supplierOptions());
  }

  initForm(): void {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required]],
      mainSku: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\-_]{3,20}$/)]],
      description: ['', [Validators.maxLength(this.maxDescriptionLength)]],
      isActive: [true],
      subSkuCode: [''],
      qty: [''],
      imageUrl: [''],
      supplierName: [this.initialSupplierName || '', [Validators.required, Validators.minLength(2)]],
      gstNumber: ['', [Validators.required]],
      locationCode: ['', [Validators.required]]
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: Event): void {
    if (this.isOpen && !this.isSubmitting()) {
      this.onCloseModal();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop') && !this.isSubmitting()) {
      this.onCloseModal();
    }
  }

  onCloseModal(): void {
    if (this.isSubmitting()) return;
    this.isSupplierDropdownOpen.set(false);
    this.close.emit();
  }

  onSkuInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    this.productForm.get('mainSku')?.setValue(upperValue, { emitEvent: false });
  }

  onSupplierInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = this.supplierOptions().filter(s => s.toLowerCase().includes(query));
    this.filteredSuppliers.set(filtered);
    this.isSupplierDropdownOpen.set(true);
  }

  selectSupplier(name: string): void {
    this.productForm.get('supplierName')?.setValue(name);
    this.isSupplierDropdownOpen.set(false);
  }

  get descriptionLength(): number {
    return this.productForm.get('description')?.value?.length || 0;
  }

  onSubmit(): void {
    console.log('Form Status:', this.productForm.status);
    console.log('Form Errors:', this.productForm.errors);
    if (this.productForm.invalid || this.isSubmitting()) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Extract raw form value explicitly guaranteeing all keys match the form controls without renaming
    const rawValue = this.productForm.getRawValue();
    console.log('1. Modal Form Raw Value:', rawValue);

    this.supplierService.handleCreateProduct(rawValue).subscribe({
      next: (createdProduct) => {
        this.isSubmitting.set(false);
        this.productForm.reset({ isActive: true });
        this.productCreated.emit(createdProduct.mainSku);
        this.close.emit();
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.isSubmitting.set(false);
      }
    });
  }
}
