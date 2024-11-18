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
    _products: Product[]; // Internal state to hold the list of products.
    _companies: Company[]; // Internal state to hold the list of companies.
    _filterPredicate: (data: ProductVM, filter: string) => boolean;
    filter: string
}

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState<ProductStoreState>({
        _products: [],
        _companies: [],
        _filterPredicate: () => true,   // Default predicate that don't filter at all 
        filter: ''
    }),
    withComputed(({ _products: products, _companies: companies }) => ({
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
            return state._productsWithCompany().filter(prod => { return state._filterPredicate()(prod, state.filter()) })
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
                            tap((res: Company[]) => patchState(state, { _companies: res }))
                        )
                    })
                )
            ),
            updateFilter(filter: string, filterPredicate?: (data: ProductVM, filter: string) => boolean) {
                patchState(state, { filter: filter, _filterPredicate: filterPredicate });
            },
            /** Delete product based on provided id. */
            deleteProduct(id: number) {
                patchState(state, { _products: state._products().filter(p => p.id !== id) })
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