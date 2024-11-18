import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';
import { Product } from '../models/product';

describe('UtilityService', () => {
  let service: UtilityService;

  const products: Product[] = [
    { id: 1, product_name: "Product 1", product_company: 111111, logo: "assets/img/bens-logo1.png", created_by: "User 1", modified_by: "User 1", modified_on: "2024-09-12 18:08:12", languages: "lang1" },
    { id: 2, product_name: "Product 2", product_company: 111111, logo: "assets/img/bens-logo2.png", created_by: "User 2", modified_by: "User 2", modified_on: "2024-09-12 18:08:12", languages: "lang2" },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter products by id', () => {
    const predicate = service.generateFilterPredicate<Product>(['id']);
    const result = products.filter(product => predicate(product, '1'));
    expect(result).toEqual([products[0]]);
  });

  it('should filter products by product_name', () => {
    const predicate = service.generateFilterPredicate<Product>(['product_name']);
    const result = products.filter(product => predicate(product, 'Product 2'));
    expect(result).toEqual([products[1]]);
  });

  it('should filter products by multiple properties', () => {
    const predicate = service.generateFilterPredicate<Product>(['product_name', 'languages']);
    const result = products.filter(product => predicate(product, 'lang2'));
    expect(result).toEqual([products[1]]);
  });

  it('should be case-insensitive', () => {
    const predicate = service.generateFilterPredicate<Product>(['product_name', 'languages']);
    const result = products.filter(product => predicate(product, 'LaNg2'));
    expect(result).toEqual([products[1]]);
  });

  it('should return an empty array when no match is found', () => {
    const predicate = service.generateFilterPredicate<Product>(['product_name', 'created_by']);
    const result = products.filter(product => predicate(product, 'valueDontExist'));
    expect(result).toEqual([]);
  });
});