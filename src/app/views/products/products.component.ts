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
  selectedType: any;
  filteredTypes: any;

  type?: Type;
  visible: boolean = false;
  selectedTypeCreate: Type | undefined;

  suppliers: Supplier[] = [];

  page!: Page;
  form!: FormGroup;

  productsService = inject(ProductsService);
  suppliersService = inject(SuppliersService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.findAll();
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

  // ESTOU TENTANDO FAZER A FILTRAGEM DOS DADOS REFLETIR NO GRID.

  findAll() {
    debugger;
    if (this.selectedProduct) {
      const id = this.selectedProduct.id;
      this.productsService.filterProduct(id).subscribe((data) => {
        console.log(data);
        this.products = data;
      });
    } else {
      this.loadGridProducts();
    }
    this.loadGridTypes();
    this.loadListProducts();
    this.loadListTypes();
  }

  loadGridProducts(): void {
    this.productsService.getPaginatedListProducts().subscribe((data) => {
      this.products = data;
    });
  }

  loadGridTypes(): void {
    this.productsService.getPaginatedListTypes().subscribe((data) => {
      this.types = data;
    });
  }

  loadListProducts(): void {
    this.productsService.getListProducts().subscribe((data) => {
      this.listProducts = data;
    });
  }

  loadListTypes(): void {
    this.productsService.getListTypes().subscribe((data) => {
      this.listTypes = data;
    });
  }

  selectProduct(product: any) {
    debugger;
    this.selectedProduct = product;
  }

  filterProduct(event: AutoCompleteCompleteEvent) {
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

  filterTypes(event: AutoCompleteCompleteEvent) {
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

  createForm(): void {
    this.visible = true;
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
  }

  createProduct(): void {
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

  editType(type: Type): void {}

  deleteType(type: Type): void {}
}
