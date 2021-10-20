import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order, OrderedProduct, OrderService} from '../order.service';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = this.orderService.orders.value;

  pendingOrders: Order[] = [];
  confirmedOrders: Order[] = [];
  ordersSub: Subscription;

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.ordersSub = this.orderService.orders.subscribe(
      newOrders => {
        this.orders = newOrders;
        this.pendingOrders = [];
        this.confirmedOrders = [];
        this.orders.forEach(order => {
          if (order.confirmed) {
            this.confirmedOrders.push(order);
          } else {
            this.pendingOrders.push(order);
          }
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.ordersSub) {
      this.ordersSub.unsubscribe();
    }
  }
}
