import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ShopService} from '../../shared/shop.service';
import {AdminProductsService} from '../admin-products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  shopId: string;
  error: string = null;

  constructor(
    private adminProductsService: AdminProductsService,
    private route: ActivatedRoute,
    private shopService: ShopService
  ) { }

  onResetShop(): void {
    this.shopService.resetShop();
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.shopId = params.shopId;
          this.adminProductsService.setShopId(this.shopId);
        }
      );
    this.adminProductsService.fetchProducts().subscribe(
      products => {
        this.fetchQuantity();
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
  }


  fetchQuantity(): void {
    if (this.shopId) {
      this.adminProductsService.fetchQuantity(this.shopId).subscribe(
        () => {},
        errorMessage => {
          this.error = errorMessage;
        });
    } else {
      this.error = 'Error in fetching quantities in stock';
    }
  }

}
