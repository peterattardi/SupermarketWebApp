import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ShopService} from '../../shared/shop.service';
import {AdminProductsService} from '../admin-products.service';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  shopId: string;
  isChangeShop = false;

  constructor(
    private adminProductsService: AdminProductsService,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  onResetShop(): void {
    this.shopService.resetShop();
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.shopId = params.shopId;
        }
      );
    this.adminProductsService.fetchProducts().subscribe(
      products => {
        this.fetchQuantity();
      },
      errorMessage => {
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
        this.openSnackBar(errorMessage, 'Ok');
      }
    );
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  fetchQuantity(): void {
    if (this.shopId) {
      this.adminProductsService.fetchQuantity(this.shopId).subscribe(
        () => {},
        errorMessage => {
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
          this.openSnackBar(errorMessage, 'Ok');
        });
    } else {
      const message = 'Error in fetching quantities in stock. ShopID is null.';
      this.openSnackBar(message, 'Ok');
    }
  }

  onChangeShop(value: boolean): void {
    this.isChangeShop = value;
  }

  onNewProduct(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
