import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Product} from './product/product.model';
import {tap} from 'rxjs/operators';

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

  addProduct(product: Product): void {
    // TODO: send http add-product [to dataStorageService]
    this.products.push(product);
    this.productsChanged.next(this.products.slice());
  }

  editProduct(index: number, newProduct: Product): void {
    // TODO: send http add-product then delete-product of the old one [to dataStorageService[
    // check if old product has the same key of new product
    // if it has the same key then first delete the old one and then add the newest
    // else add first, remove then
    this.products[index] = newProduct;
    this.productsChanged.next(this.products.slice());
  }

  deleteProduct(index: number): void {
    // TODO: send http delete-product [to dataStorageService]
    this.products.splice(index, 1);
    this.productsChanged.next(this.products.slice());
  }

}
