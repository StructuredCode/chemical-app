import { Company } from "./company";
import { Product } from "./product";

export interface ProductVM extends Product {
 company: Company
}