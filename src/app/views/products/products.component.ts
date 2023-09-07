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
import { of, switchMap } from 'rxjs';

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
  formProduct!: FormGroup;
  selectedProducts: Product[] = [];
  editedProductId: any;
  editedTypeId: any;
  viewInfoProduct?: Product[];
  selectedProduct: any;
  filteredProducts: any;
  selectedProductDelete: any;
  visibleFormProduct: boolean = false;
  visibleEditFormProduct: boolean = false;
  valueProductsCard: number = 0;
  amountProductsCard: number = 0;

  types: Type[] = [];
  listTypes: Type[] = [];
  selectedTypes: Type[] = [];
  selectedTypeByProduct: any;
  filteredTypes: any;
  visibleEditFormType: boolean = false;
  type?: Type;
  visibleFormType: boolean = false;
  selectedTypeCreate: Type | undefined;
  selectedTypeDelete: any;
  formType!: FormGroup;

  suppliers: Supplier[] = [];
  errorOccurred: boolean = false;
  page!: Page;
  buttonClearDisable?: boolean;
  viewVisible: { [key: string]: boolean } = {};

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

    setTimeout(() => {
      this.calculateCards();
    }, 200);
    this.errorOccurred = false;
  }

  clear() {
    this.selectedProduct = null;
    this.selectedTypeByProduct = null;
    this.findAll();
  }

  calculateCards() {
    this.valueProductsCard = this.products.reduce((total, product) => {
      if (product.value !== undefined && product.amount !== undefined) {
        return total + product.value * product.amount;
      } else {
        return total;
      }
    }, 0);
    this.amountProductsCard = this.products.reduce((total, product) => {
      if (product.amount !== undefined) {
        return total + product.amount;
      } else {
        return total;
      }
    }, 0);
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
    this.productsService
      .getPaginatedListProducts()
      .pipe(
        switchMap((data) => {
          this.products = data;
          return of(data);
        })
      )
      .subscribe(() => {
        this.calculateCards();
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

    this.productsService.filterProduct(id).subscribe(
      (data) => {
        this.products = [];
        this.products = data;
      },
      (error) => {
        if (!this.errorOccurred) {
          this.errorOccurred = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'filterProduct',
            detail: 'Este produto não existe!',
          });
        }
      }
    );
  }

  filterProductsByType(type: string): void {
    this.selectedTypeByProduct = type;
    const id = this.selectedTypeByProduct.id;
    this.productsService.filterProductsByType(id).subscribe(
      (data) => {
        this.products = [];
        this.products = data;
      },
      (error) => {
        if (!this.errorOccurred) {
          this.errorOccurred = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: ' filterProductsByType',
            detail: 'Este tipo não existe!',
          });
        }
      }
    );
  }

  createProduct(): void {
    this.formProduct.reset();
    this.visibleFormProduct = true;
  }

  saveProduct(): void {
    this.productsService.createProduct(this.formProduct.value).subscribe({
      complete: () => {
        this.visibleFormProduct = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          key: 'saveProduct',
          detail: 'Produto Salvo!',
        });
      },
    });
    this.calculateCards();
    setTimeout(() => {
      this.findAll();
    }, 1000);
  }

  viewProduct(id: string) {
    this.productsService.filterProduct(id).subscribe((data) => {
      this.viewInfoProduct = data;
      this.viewVisible[id] = true;
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
            if (
              response &&
              response.message === 'Product updated successfully!'
            ) {
              this.visibleEditFormProduct = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso!',
                key: 'updateProduct',
                detail: updatedProduct.name + ' Editado!',
              });
              this.findAll();
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro!',
              key: 'updateProduct',
              detail: 'Erro ao atualizar produto!',
            });
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
            key: 'deleteProduct',
            detail:
              'Produto ' + this.selectedProductDelete.name + ' Excluído...',
          });
          // Chame o método para carregar os dados do grid novamente
          this.loadGridProducts();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'deleteProduct',
            detail: 'Erro ao excluir produto!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelou...',
        key: 'deleteProduct',
        detail: 'A Exclusão foi Cancelada!',
      });
      this.loadGridProducts();
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
    this.formType.reset();
    this.visibleFormType = true;
  }

  saveType(): void {
    this.productsService.createType(this.formType.value).subscribe({
      complete: () => {
        this.visibleFormType = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          key: ' saveType',
          detail: 'Tipo de Produto Salvo!',
        });
        this.findAll();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: ' saveType',
          detail: 'Erro ao salvar o produto!',
        });
      },
    });
  }

  editType(type: Type): void {
    this.formType.patchValue({
      name: type.name,
      description: type.description,
    });
    this.editedTypeId = type.id;
    this.visibleEditFormType = true;
  }

  updateType(): void {
    if (this.formType.valid && this.editedTypeId !== null) {
      const updatedType: Type = {
        id: this.editedTypeId,
        ...this.formType.value,
      };
      this.productsService.updateType(this.editedTypeId, updatedType).subscribe(
        (response: any) => {
          if (response && response.message === 'Type updated successfully!') {
            this.visibleEditFormType = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              key: 'updateType',
              detail: updatedType.name + ' Editado!',
            });
            this.findAll();
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'updateType',
            detail: 'Erro ao atualizar o tipo!',
          });
        }
      );
    }
  }

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
            key: 'deleteType',
            detail: this.selectedTypeDelete.name + ' ' + 'Excluído...',
          });
          setTimeout(() => {
            this.findAll();
          }, 2600);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'deleteType',
            detail: 'Erro tipo atrelado a um produto!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelou...',
        key: 'deleteType',
        detail: 'A Exclusão foi Cancelada!',
      });
    }
  }
}
