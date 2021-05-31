import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Product } from '../product.model';
import { ManagementService} from '../management.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  id: number;

  constructor(private managementService: ManagementService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.product = this.managementService.getProduct(this.id);
        }
      );
  }

  // onAddToShoppingList(): void {
  //   this.managementService.addIngredientsToShoppingList(this.product.ingredients);
  // }

  onEditProduct(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteProduct(): void {
    this.managementService.deleteProduct(this.id);
    this.router.navigate(['/management']);
  }

}
