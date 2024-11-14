import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../models/product';
import { Observable, map } from 'rxjs';

const dataFile = 'assets/products.json'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http = inject(HttpClient);

  /** Get products from file. */
  getProducts(): Observable<Product[]> {
    return this.#http.get<{ data: Product[] }>(dataFile).pipe(
      map(response => response.data)
    );
  }
}
