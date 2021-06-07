import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Product } from '../../management/product/product.model';
import {UserProductsService} from '../user-products.service';

@Component({
  selector: 'app-catalogue-list',
  templateUrl: './catalogue-list.component.html',
})
export class CatalogueListComponent implements OnInit, OnDestroy {
  products: Product[];
  subscription: Subscription;

  constructor(private userProductsService: UserProductsService) { }

  ngOnInit(): void {
    this.subscription = this.userProductsService.productsChanged
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
    this.products = this.userProductsService.getProducts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
