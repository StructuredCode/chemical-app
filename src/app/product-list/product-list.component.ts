import { Component, inject, signal } from '@angular/core';
import { ProductService } from './services/product.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductStore } from './store/product.store';
import { FormsModule } from '@angular/forms';
import { ProductVM, ProductVMKeys } from '../models/product-vm';
import { UtilityService } from '../shared/utility.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, CommonModule, MatSelectModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  #productservice = inject(ProductService);
  #toastService = inject(NotificationService);
  #dialog = inject(MatDialog);
  #utilityService = inject(UtilityService);
  protected readonly inputFilterColumns: ProductVMKeys[] = ['id', 'product_name', 'created_by', 'modified_by', 'languages'];
  protected readonly displayedColumns: string[] = ['id', 'product_name', 'logo', 'companyName', 'created_by', 'modified_by', 'modified_on', 'languages', 'action'];
  protected readonly productStore = inject(ProductStore);
  protected editingId = signal<number | null>(null); // Id of current editing row.

  // Filter predicate for product table filtering.
  #productFilterPredicate = this.#utilityService.generateFilterPredicate(this.inputFilterColumns);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productStore.updateFilter(filterValue.trim(), this.#productFilterPredicate);
  }

  /**
   * Loads and opens the product details in a dialog.
   */
  openDetailsDialog(product: ProductVM): void {
    const dialogRef = this.#dialog.open(ProductDetailsComponent);
    this.#productservice.getDescription(product.id).subscribe(
      des => dialogRef.componentInstance.details.set(des)
    );
  }

  deleteProduct(id: number): void {
    this.productStore.deleteProduct(id) ? this.#toastService.showSuccess('Product deleted successfully!')
      : this.#toastService.showError('Product not deleted!');
  }

  editProduct(id: number): void {
    this.editingId.set(id);
  }

  saveProduct(product: ProductVM): void {
    this.productStore.editProduct(product) ? this.#toastService.showSuccess('Product saved!')
      : this.#toastService.showError('Product not saved!');
    this.editingId.set(null);
  }
}
