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
  products: Product[];
  subscription: Subscription;
  @Input() error: string = null;

  constructor(private adminProductsService: AdminProductsService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscription = this.adminProductsService.productsChanged
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
    this.products = this.adminProductsService.getProducts();
  }

  onNewProduct(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onClearError(): void {
    this.error = null;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
