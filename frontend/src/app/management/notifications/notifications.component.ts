import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AdminProductsService} from '../admin-products.service';
import {ShopService} from '../../shared/shop.service';
import {AuthService} from '../../auth/auth.service';
import {Product} from '../product/product.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productsSub: Subscription;
  shopId: string;
  error: string = null;

  constructor(
    private adminProductsService: AdminProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.shopId = params.shopId;
        }
      );
    this.productsSub = this.adminProductsService.products.subscribe(
      products => {
        this.products = products;
      }
    );
  }

  onContactSupplier(index: number, outOfStockProduct: Product): void {
    // mock the contact and just update the quantity with +10
    this.adminProductsService.updateQuantity(index, outOfStockProduct, 10);
  }

  hasOutOfStock(): boolean {
    let result = false;
    this.products.forEach( product => {
      if (!product.quantity || product.quantity < 1) {
        result = true;
      }
    });
    return result;
  }

  ngOnDestroy(): void {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }

}
