import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserProductsService} from '../../catalogue/user-products.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {OrderedProduct, OrderService} from '../order.service';
import {take} from 'rxjs/operators';
import {Product} from '../../management/product/product.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './orders-detail.component.html'
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order: OrderedProduct[] = [];
  orderId: number;
  productsSub: Subscription;
  products: Product[] = this.userProductsService.getProducts();
  orderTotal = 0;
  error: string = null;
  warning: string = null;
  info: string = null;

  constructor(private userProductsService: UserProductsService,
              private route: ActivatedRoute,
              private orderService: OrderService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.orderId = +params.orderId;
          this.getOrder();
        }
      );
    this.productsSub = this.userProductsService.productsChanged
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
    debugger;
  }

  getOrder(): void {
    if (!this.orderId) {
      this.error = 'Order Id not found. Please try again.';
      return;
    }
    this.orderService.getOrder(this.orderId)
      .pipe(take(1))
      .subscribe(
        orderRes => {
          this.order = orderRes;
          this.calculateTotal();
        },
        error => {
          this.error = error;
        }
      );
  }

  calculateTotal(): void {
    if (this.products.length === 0 || this.order.length === 0) {
      return;
    }
    this.orderTotal = 0;
    this.order.forEach( orderedProduct => {
      const product = this.findProduct(orderedProduct);
      this.orderTotal += orderedProduct.quantity * product.unitCost;
    });
  }

  findProduct(order: OrderedProduct): Product {
    let result: Product = null;
    this.products.forEach( product => {
      let found = false;
      if (!found && product.productName === order.productName
        && product.productBrand === order.productBrand) {
        result = product;
        found = true;
      }
    });
    return result;
  }

  onClearInfo(): void {
    this.info = null;
  }

  onClearWarning(): void {
    this.warning = null;
  }

  onClearError(): void {
    this.error = null;
  }

  ngOnDestroy(): void { }

}
