import { Page } from './../../models/page';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Type } from 'src/app/models/type';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { Supplier } from 'src/app/models/supplier';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  selectedProductDelete: any;

  viewVisible: boolean = false;

  types: Type[] = [];
  listTypes: Type[] = [];
  selectedTypes: Type[] = [];
  selectedTypeByProduct: any;
  filteredTypes: any;

  type?: Type;
  visibleFormProduct: boolean = false;
  visibleEditFormProduct: boolean = false;
  visibleFormType: boolean = false;
  selectedTypeCreate: Type | undefined;
  selectedTypeDelete: any;

  suppliers: Supplier[] = [];

  page!: Page;
  formProduct!: FormGroup;
  formType!: FormGroup;
  buttonClearDisable?: boolean;
  editedProductId: any;
  viewInfoProduct?: Product[];

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  productsService = inject(ProductsService);
  suppliersService = inject(SuppliersService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.findAll();
    this.createFormNewProduct();
    this.createFormNewType();
  }

  findAll(): void {
    if (this.selectedProduct) {
      this.buttonClearDisable = false;
      this.filterProduct(this.selectedProduct);
    } else if (this.selectedTypeByProduct) {
      this.buttonClearDisable = false;
      this.filterProductsByType(this.selectedTypeByProduct);
    } else {
      this.buttonClearDisable = true;
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
    this.formProduct = this.fb.group({
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
  }

  saveProduct(): void {
    this.productsService.createProduct(this.formProduct.value).subscribe({
      next: () => {},
      error: () => {
        this.visibleFormProduct = false;
      },
      complete: () => {
        this.visibleFormProduct = false;
      },
    });
  }

  editProduct(product: Product): void {
    this.formProduct.patchValue({
      name: product.name,
      amount: product.amount,
      value: product.value,
      type: product.type,
      supplier: product.supplier,
      description: product.description,
    });
    this.editedProductId = product.id;
    this.visibleEditFormProduct = true;
  }

  viewProduct(id: string) {
    this.productsService
      .filterProduct(id)
      .subscribe((data) => (this.viewInfoProduct = data));
      this.viewVisible = true;
  }

  updateProduct(): void {
    if (this.formProduct.valid && this.editedProductId !== null) {
      const updatedProduct: Product = {
        id: this.editedProductId,
        ...this.formProduct.value,
      };
      this.productsService
        .updateProduct(this.editedProductId, updatedProduct)
        .subscribe(
          (response: any) => {
            if (response.includes('Product updated successfully!')) {
              // Atualização bem-sucedida, faça o que for necessário (fechar modal, atualizar lista, etc.)
              this.visibleEditFormProduct = false;
              // Chame uma função para atualizar a lista de produtos, se necessário
            } else {
              // Lidar com outras respostas, se necessário
            }
          },
          (error) => {
            // Lidar com erro na atualização, se necessário
            this.visibleEditFormProduct = false;
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }
  }

  openDeleteProduct(product: any) {
    this.selectedProductDelete = product;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Excluir',
      icon: 'pi pi-info-circle',
      key: 'product',
    });
  }

  deleteProduct(confirmProduct: boolean) {
    this.confirmationService.close();
    if (confirmProduct) {
      const productIdToDelete = this.selectedProductDelete.id;
      this.productsService.deleteProduct(productIdToDelete).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: this.selectedProductDelete.name + ' ' + 'Excluído...',
          });
          setTimeout(() => {
            this.findAll();
          }, 3000);
        },
        (error) => {
          console.error('Erro ao excluir:', error);
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelou...',
        detail: 'A Exclusão foi Cancelada!',
      });
    }
  }

  // TYPES:

  createFormNewType(): void {
    this.formType = this.fb.group({
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
  }

  saveType(): void {
    this.productsService.createType(this.formType.value).subscribe(() => {});
  }

  editType(type: Type): void {}

  openDeleteType(type: any) {
    this.selectedTypeDelete = type;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Excluir',
      icon: 'pi pi-info-circle',
      key: 'type',
    });
  }

  deleteType(confirmType: boolean) {
    this.confirmationService.close();
    if (confirmType) {
      const typeIdToDelete = this.selectedTypeDelete.id;
      this.productsService.deleteType(typeIdToDelete).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: this.selectedTypeDelete.name + ' ' + 'Excluído...',
          });
          setTimeout(() => {
            this.findAll();
          }, 3000);
        },
        (error) => {
          console.error('Erro ao excluir:', error);
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelou...',
        detail: 'A Exclusão foi Cancelada!',
      });
    }
  }

  clear() {
    this.selectedProduct = null;
    this.selectedTypeByProduct = null;
    this.findAll();
  }
}
