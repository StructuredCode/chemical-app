import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals"
import { Product } from "../models/product"
import { inject } from "@angular/core"
import { ProductService } from "../services/product.service"
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { filter, map, pipe, switchMap, tap } from "rxjs";
import { ComapnyService } from "../services/comapny.service";
import { Company } from "../models/company";

export interface ProductStoreState {
    products: Product[];
    companies: Company[];
    filter: string
}

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState<ProductStoreState>({
        products: [],
        companies: [],
        filter: ''
    }),
    withComputed((state) => ({
    })),
    withMethods((state,
        productService = inject(ProductService),
        companyService = inject(ComapnyService)) => ({
            testMethod: rxMethod(
                pipe(
                    filter((num: number) => {console.log('test'); return num % 2 === 0;}),
                    tap((val) => patchState(state, { products: [] }))
                )
            ),
            _loadProducts: rxMethod<void>(
                pipe(
                    switchMap(() => {
                        return productService.getProducts().pipe(
                            tap((res: Product[]) => patchState(state, { products: res }))
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