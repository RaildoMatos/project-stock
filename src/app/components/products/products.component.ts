import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product';
import { ProductsService } from 'src/app/services/products.service';
<<<<<<< HEAD
=======
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
>>>>>>> 0d3c04e7894662094b39abe0e2b40e09f0e76297

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
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
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      type: [],
      value: ['', [Validators.required]],
      supplier: [''],
      amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  createProduct(): void {
    this.productsService.create(this.form.value).subscribe(() => {
      console.log('Produto Criado!');
    });
  }
}
