import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Product } from '../product.model';
import {AdminProductsService} from '../../admin-products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = this.adminProductsService.products.value;
  productsSub: Subscription;

  constructor(private adminProductsService: AdminProductsService) {
  }

  ngOnInit(): void {
    this.productsSub = this.adminProductsService.products
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }
}
