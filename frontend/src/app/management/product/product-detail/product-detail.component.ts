import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Product } from '../product.model';
import { AdminProductsService} from '../../admin-products.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  subProduct: Subscription;
  product: Product;
  id: number;

  constructor(private adminProductsService: AdminProductsService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.product = this.adminProductsService.getProduct(this.id);
        }
      );
    this.subProduct = this.adminProductsService.productsChanged.subscribe(
      products => {
        this.product = products[this.id];
      }
    );
  }

  // onAddToShoppingList(): void {
  //   this.adminProductsService.addIngredientsToShoppingList(this.product.ingredients);
  // }

  onEditProduct(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteProduct(): void {
    this.adminProductsService.deleteProduct(this.id);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDecrementQuantity(dec: number): void {
    const newQuantity = this.product.quantity < dec ? 0 : this.product.quantity - dec;
    this.adminProductsService.updateQuantity(this.id, this.product, newQuantity);
  }

  onIncrementQuantity(inc: number): void {
    const newQuantity = !this.product.quantity ? inc : this.product.quantity + inc;
    this.adminProductsService.updateQuantity(this.id, this.product, newQuantity);
  }

  ngOnDestroy(): void {
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
  }

}
