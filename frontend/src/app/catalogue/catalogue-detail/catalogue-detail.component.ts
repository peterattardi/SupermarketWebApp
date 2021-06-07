import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Product } from '../../management/product/product.model';
import {Subscription} from 'rxjs';
import {UserProductsService} from '../user-products.service';

@Component({
  selector: 'app-catalogue-detail',
  templateUrl: './catalogue-detail.component.html',
})
export class CatalogueDetailComponent implements OnInit, OnDestroy {
  subProduct: Subscription;
  product: Product;
  id: number;

  constructor(private userProductsService: UserProductsService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.product = this.userProductsService.getProduct(this.id);
        }
      );
    this.subProduct = this.userProductsService.productsChanged.subscribe(
      products => {
        this.product = products[this.id];
      }
    );
  }

  // onAddToShoppingList(): void {
  //   this.userProductsService.addIngredientsToShoppingList(this.product.ingredients);
  // }

  ngOnDestroy(): void {
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
  }

}
