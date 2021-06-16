import {Component, Input, OnInit} from '@angular/core';
import {CartItem} from '../../../cart/cart.service';
import {Product} from '../../../management/product/product.model';

@Component({
  selector: 'app-cart-preview-item',
  templateUrl: './cart-preview-item.component.html'
})
export class CartPreviewItemComponent implements OnInit {
  @Input() product: Product;
  @Input() cartItem: CartItem;

  constructor( ) { }

  ngOnInit(): void {
  }

}
