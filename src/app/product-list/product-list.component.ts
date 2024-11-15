import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailsComponent } from './product-details/product-details.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  #productservice = inject(ProductService);
  #dialog = inject(MatDialog);
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'product_name', 'logo', 'created_by', 'modified_by', 'modified_on', 'languages', 'action'];

  ngOnInit(): void {
    this.#productservice.getProducts().subscribe(res => this.dataSource = new MatTableDataSource(res));
  }

  /**
   * Loads and opens the product details in a dialog.
   */
  openDetailsDialog(product: Product) {
    const dialogRef = this.#dialog.open(ProductDetailsComponent);
    this.#productservice.getDescription(product.id).subscribe(
      des => dialogRef.componentInstance.details.set(des)
    );
  }
}
