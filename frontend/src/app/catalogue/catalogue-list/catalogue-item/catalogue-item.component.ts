import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../../management/product/product.model';
import {CartItem, CartService} from '../../../cart/cart.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-catalogue-item',
  templateUrl: './catalogue-item.component.html',
})
export class CatalogueItemComponent implements OnInit {
  @Input() product: Product;
  @Input() index: number;
  quantity = 1;

  constructor(
    private cartService: CartService,
    private authService: AuthService) {}


  ngOnInit(): void {
  }

  onAddToCart(): void {
    const newQuantity = (this.product.quantity < this.quantity ? this.product.quantity : this.quantity);
    const cartItem = new CartItem(
      this.product.productName,
      this.product.productBrand,
      this.product.supermarketName,
      newQuantity
    );
    this.cartService.updateCart(cartItem).subscribe(
      res => {
        alert('Added to cart: ' +
          this.product.productName + ' (' +
          newQuantity + ')');
      }
    );
  }
}
