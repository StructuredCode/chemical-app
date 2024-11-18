import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals"
import { Product } from "../models/product"
import { computed, inject } from "@angular/core"
import { ProductService } from "../services/product.service"
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { ComapnyService } from "../services/comapny.service";
import { Company } from "../models/company";
import { ProductVM } from "../models/product-vm";

export interface ProductStoreState {
    _products: Product[]; // Holds the list of products.
    companies: Company[]; // Holds the list of companies.
    _productFilterPredicate: (data: ProductVM, filter: string) => boolean; //  A predicate function used to filter the products based on the specified columns and filter string. 
    filter: string
}

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState<ProductStoreState>({
        _products: [],
        companies: [],
        _productFilterPredicate: () => true,   // Default predicate that don't filter at all 
        filter: ''
    }),
    withComputed(({ _products: products, companies: companies }) => ({
        /** Unfiltered array of products with associated company. */
        _productsWithCompany: computed(() => {
            return products().map(prod => ({
                ...prod,
                company: companies().find(c => c.id === prod.product_company) // Map each product to include the associated company.
            }) as ProductVM
            )
        })
    })),
    withComputed(state => ({
        /** Filtered products. */
        products: computed(() => {
            return state._productsWithCompany().filter(prod => { return state._productFilterPredicate()(prod, state.filter()) })
        })
    })),
    withMethods((state,
        productService = inject(ProductService),
        companyService = inject(ComapnyService)) => ({
            _loadProducts: rxMethod<void>(
                pipe(
                    switchMap(() => {
                        return productService.getProducts().pipe(
                            tap((res: Product[]) => patchState(state, { _products: res }))
                        )
                    })
                )
            ),
            _loadCompanies: rxMethod<void>(
                pipe(
                    switchMap(() => {
                        return companyService.getCompanies().pipe(
                            tap((res: Company[]) => patchState(state, { companies: res }))
                        )
                    })
                )
            ),
            /** Update filter string and associated filter predicate. */
            updateFilter(filter: string, filterPredicate?: (data: ProductVM, filter: string) => boolean) {
                patchState(state, { filter: filter, _productFilterPredicate: filterPredicate });
            },
            /** Delete product based on provided id. */
            deleteProduct(id: number): boolean {
                try {
                    patchState(state, { _products: state._products().filter(p => p.id !== id) })
                } catch (error) {
                    return false;
                }
                return true;
            },
            /** Edit product properties */
            editProduct(updatedProduct: Product): boolean {
                try {
                    patchState(state, { _products: state._products().map(p => p.id === updatedProduct.id ? updatedProduct : p) })
                } catch (error) {
                    console.error(error);
                    return false;
                }
                return true;
            }
        })
    ),
    withHooks({
        onInit({ _loadProducts, _loadCompanies }) {
            _loadProducts();
            _loadCompanies();
        }
    })
)