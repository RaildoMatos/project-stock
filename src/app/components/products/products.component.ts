import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/productModel';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  form!: FormGroup;

  productsService = inject(ProductsService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService
      .getProducts()
      .subscribe((data) => (this.products = data));
    console.log(this.products);
  }

  // createProduct(): void {
  //   this.productService.create(this.form.value).subscribe(() => {
  //     console.log('Produto Criado!');
  //   });
  // }

  createForm(): void {
    this.form = this.fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      type: [],
      price: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
}
