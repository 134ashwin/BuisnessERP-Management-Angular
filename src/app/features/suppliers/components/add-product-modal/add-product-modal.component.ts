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
  isLoadingSuppliers = signal(false); // Indicates active HTTP fetch
  maxDescriptionLength = 250;

  // Signal starts empty - will be populated from DB call
  supplierOptions = signal<string[]>([]);
  filteredSuppliers = signal<string[]>([]);
  isSupplierDropdownOpen = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliersFromDb(); // Fetch dynamic supplier data on component init
  }

  /**
   * Fetches suppliers from the database via SupplierService
   * and updates the reactive signals without disturbing existing functionality.
   */
  loadSuppliersFromDb(): void {
    this.isLoadingSuppliers.set(true);
    
    // Calls getSupplierNames() which returns string[]
    this.supplierService.getSupplierNames().subscribe({
      next: (suppliers: string[]) => {
        this.supplierOptions.set(suppliers);
        this.filteredSuppliers.set(suppliers);
        this.isLoadingSuppliers.set(false);

        const control = this.productForm.get('supplierName');
        if (control?.value) {
          control.updateValueAndValidity();
        }
      },
      error: (err: unknown) => {
        console.error('Failed to load suppliers:', err);
        this.isLoadingSuppliers.set(false);
      }
    });
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
      supplierName: [
        this.initialSupplierName || '',
        [
          Validators.required,
          // Custom Validator: Rejects any value that is not an exact match to an existing supplier in DB
          (control) => {
            const val = control.value?.trim().toLowerCase();
            if (!val) return null;
            const exists = this.supplierOptions().some(s => s.toLowerCase() === val);
            return exists ? null : { mustSelectExistingSupplier: true };
          }
        ]
      ],
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

  // Filters dropdown options as user types and keeps dropdown open
  onSupplierInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const filtered = this.supplierOptions().filter(s => s.toLowerCase().includes(query));
    this.filteredSuppliers.set(filtered);
    this.isSupplierDropdownOpen.set(true);
  }

  // Explicitly assigns chosen supplier, updates validation, and shuts dropdown
  selectSupplier(name: string): void {
    const control = this.productForm.get('supplierName');
    control?.setValue(name);
    control?.markAsTouched();
    control?.updateValueAndValidity();
    this.isSupplierDropdownOpen.set(false);
  }

  get descriptionLength(): number {
    return this.productForm.get('description')?.value?.length || 0;
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.isSubmitting()) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const rawValue = this.productForm.getRawValue();

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