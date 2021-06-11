import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserProductsService} from '../../catalogue/user-products.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {Order, OrderedProduct, OrderService} from '../order.service';
import {take} from 'rxjs/operators';
import {Product} from '../../management/product/product.model';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Delivery, DeliveryService} from '../delivery.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './orders-detail.component.html'
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  orderedProducts: OrderedProduct[] = [];
  orderId: number;
  order: Order = null;
  orderSubTotal = 0;
  orderTotal = 0;
  products: Product[] = [];

  deliveryForm: FormGroup;
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
          this.order = this.orderService.getOrderById(this.orderId);
          this.getProducts();
          this.getOrderedProducts();
          this.getDelivery();
        }
      );
  }

  private initForm(): void {
    let address = '';
    let date = null;
    let payment = '';

    if (this.delivery) {
      address = this.delivery.address;
      date = this.delivery.date;
      payment = this.delivery.payment;
    }

    this.deliveryForm = new FormGroup({
      address: new FormControl(address, Validators.required),
      date: new FormControl(date, Validators.required),
      payment: new FormControl(payment, Validators.required),
    });
  }

  getProducts(): void {
    this.userProductsService.fetchProducts(false, this.order.supermarket, false)
      .pipe(take(1))
      .subscribe(
        products => {
          this.products = products;
        },
        errorMessage => {
          this.error = errorMessage;
        }
      );
  }

  getOrderedProducts(): void {
    if (!this.orderId) {
      this.error = 'Order Id not found. Please try again.';
      return;
    }
    this.orderService.getOrderedProducts(this.orderId)
      .pipe(take(1))
      .subscribe(
        orderRes => {
          this.orderedProducts = orderRes;
          this.calculateTotal();
        },
        errorMessage => {
          if (errorMessage === 'Token not found') {
            this.authService.logout();
          }
          this.error = errorMessage;
        }
      );
  }

  calculateTotal(): void {
    if (this.products.length === 0 || this.orderedProducts.length === 0) {
      return;
    }
    this.orderSubTotal = 0;
    this.orderedProducts.forEach(orderedProduct => {
      const product = this.findProduct(orderedProduct);
      this.orderSubTotal += orderedProduct.quantity * product.unitCost;
    });
    this.orderTotal = this.orderSubTotal + 3;
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

  onSubmit(): void {
    if (!this.deliveryForm.valid) {
      this.error = 'Form is not valid. Try again';
      return;
    }
    this.isLoading = true;

    const newDelivery = new Delivery(
      this.orderId,
      this.deliveryForm.value.address,
      this.deliveryForm.value.payment,
      this.deliveryForm.value.date
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
            this.warning = null; // warning saying to set delivery info
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
    this.deliveryForm.reset();
  }

  onUpdate(): void {
    this.updateMode = true;
    this.initForm();
  }

  isTheSame(): boolean {
    const delForm = this.deliveryForm.value;
    if (this.delivery) {
      return delForm.address === this.delivery.address &&
        delForm.date === this.delivery.date &&
        delForm.payment === this.delivery.payment;
    } else {
      return !delForm.address &&
        !delForm.date && !delForm.payment;
    }
  }

  onCancelUpdate(): void {
    this.updateMode = false;
  }

  onConfirmOrder(): void {
    this.orderService.confirmOrder(this.orderId)
      .pipe(take(1))
      .subscribe( () => {
          this.info = 'Order #' + this.orderId + ' confirmed!';
        },
        errorMessage => {
          this.error = errorMessage;
        }
      );
  }

  ngOnDestroy(): void { }

}
