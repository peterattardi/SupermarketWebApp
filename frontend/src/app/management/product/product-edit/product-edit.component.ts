import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {FormGroup, FormControl, FormArray, Validators, AbstractControl} from '@angular/forms';
import {AdminProductsService} from '../../admin-products.service';
import {MarketService, Supermarket} from '../../../shared/market.service';
import {Subscription} from 'rxjs';
import {Product} from '../product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  productForm: FormGroup;
  marketSub: Subscription;
  supermarket: Supermarket;

  constructor(
    private route: ActivatedRoute,
    private adminProductsService: AdminProductsService,
    private router: Router,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = !!params.id ;
      this.initForm();
    });
    this.marketSub = this.marketService.supermarket.subscribe(
      supermarket => {
        this.supermarket = supermarket;
      }
    );
  }

  onSubmit(): void {
    const newProduct = this.createProduct(this.productForm.value);
    if (this.editMode) {
      this.adminProductsService.editProduct(this.id, newProduct);
    } else {
      this.adminProductsService.addProduct(newProduct);
    }
    this.onCancel();
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private createProduct(form: any): Product {
    return new Product(
      form.productName,
      form.productBrand,
      form.url,
      form.productDescription,
      form.nutritionFacts,
      form.supplierId,
      form.unitCost,
      form.unitType,
      this.supermarket.name
    );
  }

  private initForm(): void {
    let productName = '';
    let productBrand = '';
    let productImagePath = '';
    let productDescription = '';
    let nutritionFacts = '';
    let supplierId = 0;
    let unitCost = 0.0;
    let unitType = '';

    if (this.editMode) {
      const product = this.adminProductsService.getProduct(this.id);
      productName = product.productName;
      productBrand = product.productBrand;
      productImagePath = product.url;
      productDescription = product.productDescription;
      nutritionFacts = product.nutritionFacts;
      supplierId = product.supplierId;
      unitCost = product.unitCost;
      unitType = product.unitType;
    }

    this.productForm = new FormGroup({
      productName: new FormControl(productName, Validators.required),
      productBrand: new FormControl(productBrand, Validators.required),
      url: new FormControl(productImagePath),
      productDescription: new FormControl(productDescription),
      nutritionFacts: new FormControl(nutritionFacts),
      supplierId: new FormControl(supplierId),
      unitCost: new FormControl(unitCost),
      unitType: new FormControl(unitType)
    });
  }

  ngOnDestroy(): void {
    if (this.marketSub) {
      this.marketSub.unsubscribe();
    }
  }
}
