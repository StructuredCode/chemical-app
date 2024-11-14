import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  #productservice = inject(ProductService);
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'product_name', 'logo', 'created_by', 'modified_by', 'modified_on', 'languages', 'action'];

  ngOnInit(): void {
    this.#productservice.getProducts().subscribe(res => this.products = res);
  }
}
