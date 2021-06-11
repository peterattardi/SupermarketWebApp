import {Component, Input, OnInit} from '@angular/core';
import {Order, OrderService} from '../../order.service';
import {take} from 'rxjs/operators';
import {Delivery, DeliveryService} from '../../delivery.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-orders-item',
  templateUrl: './orders-item.component.html'
})
export class OrdersItemComponent implements OnInit {
  @Input() order: Order;
  delivery: Delivery = null;
  error: string = null;
  warning: string = null;
  deleteMessage: string = null;
  cancelMessage: string = null;

  constructor(private orderService: OrderService,
              private deliveryService: DeliveryService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getDelivery();
  }

  tryDeleteOrder(): void {
    this.deleteMessage = 'Do you really want to delete Order #' +
    this.order.orderId + '?';
  }

  tryCancelOrder(): void {
    this.cancelMessage = 'Do you really want to cancel Order #' +
      this.order.orderId + '?';
  }

  onCancelDelete(): void {
    this.deleteMessage = null;
  }

  onCancel(): void {
    this.cancelMessage = null;
  }

  onDeleteOrder(): void {
    // this.deleteMessage = null;
    this.orderService.deleteOrder(this.order.orderId)
      .pipe(take(1))
      .subscribe(
        () => { },
        errorMessage => {
          if (errorMessage === 'Token not found') {
            this.authService.logout();
          }
          this.error = errorMessage;
          this.deleteMessage = null;
        }
    );
  }

  onClearError(): void {
    this.error = null;
  }

  onClearWarning(): void {
    this.warning = null;
  }


  getDelivery(): void {
    if (!this.order.orderId) {
      this.error = 'Order Id not found. Please try again.';
      return;
    }
    this.deliveryService.getDelivery(this.order.orderId)
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
            this.delivery = null;
          } else {
            this.error = errorMessage;
          }
        }
      );
  }

  onConfirmOrder(): void {
    if (!this.delivery) {
      this.warning = 'Please complete delivery information before confirming the order';
      return;
    }
    this.orderService.confirmOrder(this.order.orderId)
      .pipe(take(1))
      .subscribe(
        () => {},
        errorMessage => {
          this.error = errorMessage;
        }
      );
  }

  onCancelOrder(): void {
    this.orderService.cancelOrder(this.order.orderId)
      .pipe(take(1))
      .subscribe(
        () => {},
        errorMessage => {
          this.error = errorMessage;
        }
      );
  }

}
