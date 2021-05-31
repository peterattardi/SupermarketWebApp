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
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit(): void {
    // const newProduct = new Product(
    //   this.productForm.value['name'],
    //   this.productForm.value['description'],
    //   this.productForm.value['imagePath'],
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
    let productImagePath = '';
    let productDescription = '';

    if (this.editMode) {
      const product = this.managementService.getProduct(this.id);
      productName = product.name;
      productImagePath = product.imagePath;
      productDescription = product.description;
    }

    this.productForm = new FormGroup({
      name: new FormControl(productName, Validators.required),
      imagePath: new FormControl(productImagePath, Validators.required),
      description: new FormControl(productDescription, Validators.required),
    });
  }
}
