import {Injectable} from '@angular/core'
import {Subject} from 'rxjs';
import {Product} from './product.model';

@Injectable({providedIn: 'root'})
export class ManagementService {
  productsChanged = new Subject<Product[]>();
  private products: Product[] = [];

  constructor() { }

  setProducts(products: Product[]): void {
    this.products = products;
    this.productsChanged.next(this.products.slice());
  }

  getProducts(): Product[] {
    return this.products.slice();
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.slService.addIngredients(ingredients);
  // }

  addProduct(product: Product): void{
    this.products.push(product);
    this.productsChanged.next(this.products.slice());
  }

  editProduct(index: number, newProduct: Product): void {
    this.products[index] = newProduct;
    this.productsChanged.next(this.products.slice());
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
    this.productsChanged.next(this.products.slice());
  }
}
