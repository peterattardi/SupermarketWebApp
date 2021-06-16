import {Component, Input, OnInit} from '@angular/core';
import {Order, OrderService} from '../../order.service';
import {take} from 'rxjs/operators';
import {Delivery, DeliveryService} from '../../delivery.service';
import {AuthService} from '../../../auth/auth.service';
import {DialogComponent, DialogData} from '../../../shared/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders-item',
  templateUrl: './orders-item.component.html'
})
export class OrdersItemComponent implements OnInit {
  @Input() order: Order;
  delivery: Delivery = null;

  constructor(private orderService: OrderService,
              private deliveryService: DeliveryService,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getDelivery();
  }

  openDialog(message: string, header: string, action: string): void {
    const data = new DialogData(header, message);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'DELETE') {
          this.onDeleteOrder();
        } else if (action === 'CANCEL') {
          this.onCancelOrder();
        }
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  tryDeleteOrder(): void {
    const message = 'Do you really want to delete Order #' +
    this.order.orderId + '?';
    this.openDialog(message, 'Confirm Delete', 'DELETE');
  }

  tryCancelOrder(): void {
    const message = 'Do you really want to cancel Order #' +
      this.order.orderId + '?';
    this.openDialog(message, 'Confirm Cancel', 'CANCEL');
  }

  onDeleteOrder(): void {
    this.orderService.deleteOrder(this.order.orderId)
      .pipe(take(1))
      .subscribe(
        () => {
          const message = 'Order #' + this.order.orderId + ' has been removed.';
          this.openSnackBar(message, 'Dismiss');
          },
        errorMessage => {
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
          this.openSnackBar(errorMessage, 'Ok');
        }
    );
  }


  getDelivery(): void {
    if (!this.order.orderId) {
      const message = 'Order Id not found. Please try again.';
      this.openSnackBar(message, 'Ok');
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
            this.openSnackBar(errorMessage, 'Ok');
          }
        }
      );
  }

  onConfirmOrder(): void {
    if (!this.delivery) {
      const message = 'Please complete delivery information before confirming the order';
      this.openSnackBar(message, 'Ok');
      return;
    }
    this.orderService.confirmOrder(this.order.orderId)
      .pipe(take(1))
      .subscribe(
        () => {
          const message = 'Order #' + this.order.orderId + ' has been confirmed.';
          this.openSnackBar(message, 'Dismiss');
          },
        errorMessage => {
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
  }

  onCancelOrder(): void {
    this.orderService.cancelOrder(this.order.orderId)
      .pipe(take(1))
      .subscribe(
        () => {
          const message = 'Order #' + this.order.orderId + ' has been canceled.';
          this.openSnackBar(message, 'Dismiss');
        },
        errorMessage => {
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
  }

}
