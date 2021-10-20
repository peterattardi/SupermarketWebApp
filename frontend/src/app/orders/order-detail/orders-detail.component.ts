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
import {MatSnackBar} from '@angular/material/snack-bar';

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


  constructor(private userProductsService: UserProductsService,
              private route: ActivatedRoute,
              private orderService: OrderService,
              private authService: AuthService,
              private deliveryService: DeliveryService,
              private snackBar: MatSnackBar) { }

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

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
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
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
  }

  getOrderedProducts(): void {
    if (!this.orderId) {
      const message = 'Order Id not found. Please try again.';
      this.openSnackBar(message, 'Ok');
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
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
          this.openSnackBar(errorMessage, 'Ok');
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
      const message = 'Order Id not found. Please try again.';
      this.openSnackBar(message, 'Ok');
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
            const message = 'Please insert the delivery information and the payment method!';
            this.openSnackBar(message, 'Dismiss');
          } else {
            this.openSnackBar(errorMessage, 'Ok');
          }
        }
      );
  }

  onSubmit(): void {
    if (!this.deliveryForm.valid) {
      const message = 'Form is not valid. Try again';
      this.openSnackBar(message, 'Ok');
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
            this.openSnackBar(res, 'Dismiss');
          },
          errorMessage => {
            this.isLoading = false;
            this.openSnackBar(errorMessage, 'Ok');
          }
        );
    } else {
      this.deliveryService.scheduleDelivery(newDelivery)
        .subscribe(res => { // warning saying to set delivery info
            this.isLoading = false;
            this.updateMode = false;
            this.delivery = newDelivery;
            this.openSnackBar(res, 'Dismiss');
          },
          errorMessage => {
            this.isLoading = false;
            this.openSnackBar(errorMessage, 'Ok');
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
          const message = 'Order #' + this.orderId + ' confirmed!';
          this.openSnackBar(message, 'Ok');
        },
        errorMessage => {
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
  }

  ngOnDestroy(): void { }

}
