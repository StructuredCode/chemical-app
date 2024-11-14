import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../models/product';
import { Observable, map } from 'rxjs';

const DATA_FOLDER = 'assets/'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http = inject(HttpClient);

  /**
   * Get products from file.
   */
  getProducts(): Observable<Product[]> {
    return this.#http.get<{ data: Product[] }>(DATA_FOLDER + 'products.json').pipe(
      map(response => response.data)
    );
  }

  /**
   * Get product detail based on product id.
   */
  getDescription(idProduct: number): Observable<string> {
    const dataFile = DATA_FOLDER + idProduct + '.json';

    return this.#http.get<{ data: { description:string} }>(dataFile).pipe(
      map(response => response.data.description)
    );
  }
}
