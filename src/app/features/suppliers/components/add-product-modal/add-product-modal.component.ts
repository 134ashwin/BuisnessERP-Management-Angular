import { Component, EventEmitter, HostListener, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { SupplierInfo } from '../../models/supplier-product.model';

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
  supplierDetails = signal<SupplierInfo[]>([]);
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
    
    this.supplierService.getSuppliersDetails().subscribe({
      next: (suppliers: SupplierInfo[]) => {
        this.supplierDetails.set(suppliers);

        // Filter out duplicate names (case-insensitive & trimmed)
        const uniqueSupplierNames = Array.from(
          new Map(
            suppliers
              .filter(s => s?.name)
              .map(s => [s.name.trim().toLowerCase(), s.name.trim()])
          ).values()
        );

        this.supplierOptions.set(uniqueSupplierNames);
        this.filteredSuppliers.set(uniqueSupplierNames);
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

    // Case-insensitive lookup handling both 'GstNumber' and 'gstNumber' from API JSON response
    const selectedSupplier = this.supplierDetails().find(
      s => s.name?.trim().toLowerCase() === name?.trim().toLowerCase()
    );

    if (selectedSupplier) {
      // Check uppercase, lowercase, and alternative property names from backend
      const gstValue = selectedSupplier.GstNumber 
        || (selectedSupplier as any).gstNumber 
        || (selectedSupplier as any).gst;

      if (gstValue) {
        const gstControl = this.productForm.get('gstNumber');
        gstControl?.setValue(gstValue);
        gstControl?.markAsTouched();
        gstControl?.updateValueAndValidity();
      }

      // Optional: Auto-fill locationCode if present in backend response
      const locationValue = selectedSupplier.location 
        || (selectedSupplier as any).locationCode;

      if (locationValue) {
        const locationControl = this.productForm.get('locationCode');
        locationControl?.setValue(locationValue);
        locationControl?.markAsTouched();
        locationControl?.updateValueAndValidity();
      }
    }
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