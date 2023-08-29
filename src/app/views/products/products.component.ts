import { Page } from './../../models/page';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Type } from 'src/app/models/type';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { Supplier } from 'src/app/models/supplier';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  listProducts: Product[] = [];
  selectedProducts: Product[] = [];
  selectedProduct: any;
  filteredProducts: any;

  types: Type[] = [];
  listTypes: Type[] = [];
  selectedTypes: Type[] = [];
  selectedTypeByProduct: any;
  filteredTypes: any;

  type?: Type;
  visibleFormProduct: boolean = false;
  visibleFormType: boolean = false;
  selectedTypeCreate: Type | undefined;

  suppliers: Supplier[] = [];

  page!: Page;
  form!: FormGroup;

  productsService = inject(ProductsService);
  suppliersService = inject(SuppliersService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    if (this.selectedProduct) {
      this.filterProduct(this.selectedProduct);
    } else if (this.selectedTypeByProduct) {
      this.filterProductsByType(this.selectedTypeByProduct);
    } else {
      this.loadGridProducts();
    }
    this.loadGridTypes();
    this.loadListProducts();
    this.loadListTypes();
  }

  // PRODUCTS:

  createFormNewProduct(): void {
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
    this.form = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      type: [],
      value: ['', [Validators.required]],
      supplier: [''],
      amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  loadGridProducts(): void {
    this.productsService.getPaginatedListProducts().subscribe((data) => {
      this.products = data;
    });
  }

  loadListProducts(): void {
    this.productsService.getListProducts().subscribe((data) => {
      this.listProducts = data;
    });
  }

  loadFilterProduct(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listProducts as any[]).length; i++) {
      let product = (this.listProducts as any[])[i];
      if (product.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.filteredProducts = filtered;
  }

  filterProduct(product: string): void {
    this.selectedProduct = product;
    const id = this.selectedProduct.id;
    this.productsService.filterProduct(id).subscribe((data) => {
      this.products = [];
      this.products = data;
    });
  }

  filterProductsByType(type: string): void {
    this.selectedTypeByProduct = type;
    const id = this.selectedTypeByProduct.id;
    this.productsService.filterProductsByType(id).subscribe((data) => {
      this.products = [];
      this.products = data;
    });
  }

  createProduct(): void {
    this.visibleFormProduct = true;
    this.createFormNewProduct();
  }

  saveProduct(): void {
    this.productsService.createProduct(this.form.value).subscribe(() => {
      console.log('Produto Criado!');
      console.log(this.form.value);
    });
  }

  editProduct(product: Product): void {}

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe(
      () => {
        console.log('Product deleted successfully.');
        // Adicionar comportamento de sucesso após exclusão.
      },
      (error) => {
        console.error('Error deleting product:', error);
        // Adicionar comportamento de erro após exclusão.
      }
    );
  }

  // TYPES:

  createFormNewType(): void {
    this.form = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  loadGridTypes(): void {
    this.productsService.getPaginatedListTypes().subscribe((data) => {
      this.types = data;
    });
  }

  loadListTypes(): void {
    this.productsService.getListTypes().subscribe((data) => {
      this.listTypes = data;
    });
  }

  loadFilterTypes(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listTypes as any[]).length; i++) {
      let type = (this.listTypes as any[])[i];
      if (type.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(type);
      }
    }
    this.filteredTypes = filtered;
  }

  createType(): void {
    this.visibleFormType = true;
    this.createFormNewType();
  }

  saveType(): void {
    this.productsService.createType(this.form.value).subscribe(() => {
      console.log('Type Criado!');
      console.log(this.form.value);
    });
  }

  editType(type: Type): void {}

  deleteType(id: number): void {
    this.productsService.deleteType(id).subscribe(
      () => {
        console.log('Type deleted successfully.');
        // Adicionar comportamento de sucesso após exclusão.
      },
      (error) => {
        console.error('Error deleting type:', error);
        // Adicionar comportamento de erro após exclusão.
      }
    );
  }
}
