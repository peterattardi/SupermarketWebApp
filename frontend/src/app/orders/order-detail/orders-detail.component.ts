import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserProductsService} from '../../catalogue/user-products.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {OrderedProduct, OrderService} from '../order.service';
import {take} from 'rxjs/operators';
import {Product} from '../../management/product/product.model';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {Delivery, DeliveryService} from '../delivery.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './orders-detail.component.html'
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order: OrderedProduct[] = [];
  orderId: number;
  orderTotal = 0;
  products: Product[] = this.userProductsService.getProducts();
  productsSub: Subscription;

  delivery: Delivery = null;
  isLoading = false;
  updateMode = false;

  error: string = null;
  warning: string = null;
  info: string = null;

  constructor(private userProductsService: UserProductsService,
              private route: ActivatedRoute,
              private orderService: OrderService,
              private authService: AuthService,
              private deliveryService: DeliveryService) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.orderId = +params.orderId;
          this.getOrder();
          this.getDelivery();
        }
      );
    this.productsSub = this.userProductsService.productsChanged
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
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
        errorMessage => {
          this.error = errorMessage;
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

  getDelivery(): void {
    if (!this.orderId) {
      this.error = 'Order Id not found. Please try again.';
      return;
    }
    this.deliveryService.getDelivery(this.orderId)
      .pipe(take(1))
      .subscribe(
        delivery => {
          this.delivery = new Delivery(
            delivery.orderId,
            delivery.address,
            delivery.payment,
            delivery.date
          );
        },
        errorMessage => {
          if (errorMessage === 'Delivery not found.') {
            this.warning = 'Please insert the delivery information and the payment method!';
          } else {
            this.error = errorMessage;
          }
        }
      );
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

  onConfirm(form: NgForm): void {
    if (!form.valid) {
      this.error = 'Form is not valid. Try again';
      return;
    }
    this.isLoading = true;

    const newDelivery = new Delivery(
      this.orderId,
      form.value.address,
      form.value.payment,
      form.value.date
    );

    if (this.delivery) {
      this.deliveryService.updateDelivery(newDelivery)
        .subscribe(
          res => {
            this.isLoading = false;
            this.updateMode = false;
            this.delivery = newDelivery;
            this.info = res;
          },
          errorMessage => {
            this.isLoading = false;
            this.error = errorMessage;
          }
        );
    } else {
      this.deliveryService.scheduleDelivery(newDelivery)
        .subscribe(res => {
            this.isLoading = false;
            this.updateMode = false;
            this.delivery = newDelivery;
            this.info = res;
          },
          errorMessage => {
            this.isLoading = false;
            this.error = errorMessage;
          }
        );
    }
    form.reset();
  }

  onUpdate(): void {
    this.updateMode = true;
  }

  onCancelUpdate(): void {
    this.updateMode = false;
  }

  ngOnDestroy(): void { }

}
