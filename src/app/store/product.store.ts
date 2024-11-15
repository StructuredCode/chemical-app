import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals"
import { Product } from "../models/product"
import { computed, inject } from "@angular/core"
import { ProductService } from "../services/product.service"
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { filter, pipe, switchMap, tap } from "rxjs";
import { ComapnyService } from "../services/comapny.service";
import { Company } from "../models/company";
import { ProductVM } from "../models/product-vm";

export interface ProductStoreState {
    _products: Product[];
    _companies: Company[];
    filter: string
}

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState<ProductStoreState>({
        _products: [],
        _companies: [],
        filter: ''
    }),
    withComputed(({ _products: products, _companies: companies }) => ({
        products: computed(() => {
            return products().map(prod => ({
                ...prod,
                company: companies().find(c => c.id === prod.product_company)
            }) as ProductVM
            )
        })
    })),
    withMethods((state,
        productService = inject(ProductService),
        companyService = inject(ComapnyService)) => ({
            testMethod: rxMethod(
                pipe(
                    filter((num: number) => { console.log('test'); return num % 2 === 0; }),
                    tap((val) => patchState(state, { _products: [] }))
                )
            ),
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
            )
        })
    ),
    withHooks({
        onInit({ _loadProducts, _loadCompanies }) {
            _loadProducts();
            _loadCompanies();
            console.log('store init');
        }
    })



)