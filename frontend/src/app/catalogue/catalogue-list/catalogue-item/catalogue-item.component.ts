import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../../management/product/product.model';

@Component({
  selector: 'app-catalogue-item',
  templateUrl: './catalogue-item.component.html',
})
export class CatalogueItemComponent implements OnInit {
  @Input() product: Product;
  @Input() index: number;

  ngOnInit(): void {
  }
}
