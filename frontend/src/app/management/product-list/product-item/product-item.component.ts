import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  @Input() index: number;

  ngOnInit(): void {
  }
}
