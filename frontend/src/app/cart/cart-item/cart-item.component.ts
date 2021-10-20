import {Component, Input, OnInit} from '@angular/core';
import {CartItem, CartService} from '../cart.service';
import {Product} from '../../management/product/product.model';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent, DialogData} from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  @Input() product: Product;
  @Input() cartItem: CartItem;
  quantity = 1;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openDialog(message: string, header: string): void {
    const data = new DialogData(header, message);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteCartItem();
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  onDecrementQuantity(dec: number): void {
    const tempQuantity = this.cartItem.quantity < dec ? 0 : this.cartItem.quantity - dec;
    if (tempQuantity < 1) {
      this.tryDeleteCartItem();
    } else {
      this.cartItem.quantity = tempQuantity;
      this.cartService.updateCart(this.cartItem).subscribe(
        () => {},
        errorMessage => {
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
    }
  }

  onIncrementQuantity(inc: number): void {
    if (this.cartItem.quantity === this.product.quantity) {
      const message = 'Sorry, we have no more than ' + this.product.quantity + ' of this item right now';
      this.openSnackBar(message, 'Ok');
      return;
    }
    if (this.product && this.cartItem) {
      if (inc + this.cartItem.quantity > this.product.quantity) {
        this.cartItem.quantity = this.product.quantity;
        const message = 'Sorry, we have no more than ' + this.product.quantity + ' of this item right now';
        this.openSnackBar(message, 'Ok');
      } else {
        this.cartItem.quantity = inc + this.cartItem.quantity;
      }
      this.cartService.updateCart(this.cartItem).subscribe(
        () => {},
        errorMessage => {
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
    }
  }

  tryDeleteCartItem(): void {
    const message = 'Do you really want to delete "' +
       this.cartItem.productName + '" from the cart?';
    this.openDialog(message, 'Confirm Delete');
  }

  onDeleteCartItem(): void {
    this.cartService.deleteCart(this.cartItem).subscribe(
      () => {},
      errorMessage => {
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
        this.openSnackBar(errorMessage, 'Ok');
      }
    );
  }

}
