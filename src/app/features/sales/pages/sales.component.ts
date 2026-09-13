import { Component, inject, signal, OnInit } from '@angular/core';
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

  salesOrders = signal<SalesOrder[]>([]);
  isUploading = signal(false);

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.salesService.getSalesOrders().subscribe({
      next: (data) => this.salesOrders.set(data),
      error: (err) => console.error('Failed to load sales orders:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    console.log('Selected Excel file:', file.name, file.size);

    this.isUploading.set(true);

    this.salesService.importExcel(file).subscribe({
      next: (res) => {
        alert(res.message);
        this.isUploading.set(false);
        input.value = ''; // Reset file input to allow re-uploading same file
        this.loadSales(); // Refresh grid dynamically from SQL database
      },
      error: (err) => {
        console.error('Excel Import HTTP Error:', err);
        const errorMsg = err.error?.message || 'Upload failed. Check F12 network tab.';
        alert(`Upload Failed: ${errorMsg}`);
        this.isUploading.set(false);
        input.value = ''; // Reset file input on failure as well
      }
    });
  }
}