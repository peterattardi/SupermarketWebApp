import {Component, Input, OnInit} from '@angular/core';
import {OrderedProduct} from '../../order.service';
import {Product} from '../../../management/product/product.model';

@Component({
  selector: 'app-order-detail-product',
  templateUrl: './order-detail-product.component.html'
})
export class OrderDetailProductComponent implements OnInit {
  @Input() order: OrderedProduct;
  @Input() product: Product;

  constructor() { }

  ngOnInit(): void {
  }

}
