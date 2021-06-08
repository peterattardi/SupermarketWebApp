import {Component, Input, OnInit} from '@angular/core';
import {CartItem, CartService} from '../cart.service';
import {Product} from '../../management/product/product.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  @Input() product: Product;
  @Input() cartItem: CartItem;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
  }

  onDecrementQuantity(dec: number): void {
    this.cartItem.quantity = this.cartItem.quantity < dec ? 0 : this.cartItem.quantity - dec;
    if (this.cartItem.quantity < 1) {
      this.onDeleteCartItem();
    } else {
      this.cartService.updateCart(this.cartItem).subscribe();
    }
  }

  onIncrementQuantity(inc: number): void {
    if (this.product && this.cartItem) {
      this.cartItem.quantity = (inc + this.cartItem.quantity > this.product.quantity ?
        this.product.quantity : inc + this.cartItem.quantity);
      this.cartService.updateCart(this.cartItem).subscribe();
    }
  }

  onDeleteCartItem(): void {
    this.cartService.deleteCart(this.cartItem).subscribe();
  }

}
