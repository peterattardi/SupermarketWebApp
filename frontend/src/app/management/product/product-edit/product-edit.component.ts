import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {FormGroup, FormControl, FormArray, Validators, AbstractControl} from '@angular/forms';
import {ManagementService} from '../management.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  id: number;
  editMode = false;
  productForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private managementService: ManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] !== null;
      this.initForm();
    });
  }

  onSubmit(): void {
    // const newProduct = new Product(
    //   this.productForm.value['name'],
    //   this.productForm.value['description'],
    //   this.productForm.value['url'],
    //   this.productForm.value['ingredients']);
    if (this.editMode) {
      this.managementService.editProduct(this.id, this.productForm.value);
    } else {
      this.managementService.addProduct(this.productForm.value);
    }
    this.onCancel();
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm(): void {
    let productName = '';
    let productBrand = '';
    let productImagePath = '';
    let productDescription = '';
    let nutritionFacts = '';
    let unitCost = 0.0;
    let unitType = '';

    if (this.editMode) {
      const product = this.managementService.getProduct(this.id);
      productName = product.productName;
      productBrand = product.productBrand;
      productImagePath = product.url;
      productDescription = product.productDescription;
      nutritionFacts = product.nutritionFacts;
      unitCost = product.unitCost;
      unitType = product.unitType;
    }

    this.productForm = new FormGroup({
      productName: new FormControl(productName, Validators.required),
      productBrand: new FormControl(productBrand, Validators.required),
      url: new FormControl(productImagePath),
      productDescription: new FormControl(productDescription),
      nutritionFacts: new FormControl(nutritionFacts),
      unitCost: new FormControl(unitCost),
      unitType: new FormControl(unitType)
    });
  }
}
