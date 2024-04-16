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
  formProduct!: FormGroup;
  formType!: FormGroup;

  listProducts: Product[] = [];
  selectedProducts: Product[] = [];
  products: Product[] = [];
  viewInfoProduct?: Product[];

  editedProductId: any;
  selectedProduct: any;
  filteredProducts: any;
  selectedProductDelete: any;
  visibleFormProduct: boolean = false;
  visibleEditFormProduct: boolean = false;

  valueProductsCard: number = 0;
  amountProductsCard: number = 0;
  amountSuppliersCard: number = 0;
  suppliersCard: Supplier[] = [];
  cardSupplier: boolean = false;

  types: Type[] = [];
  listTypes: Type[] = [];
  selectedTypes: Type[] = [];
  selectedTypeByProduct: any;
  editedTypeId: any;
  filteredTypes: any;
  type?: Type;
  visibleEditFormType: boolean = false;
  visibleFormType: boolean = false;
  selectedTypeCreate?: Type;
  selectedTypeDelete: any;

  suppliers: Supplier[] = [];
  supplierName?: any;
  supplierCountry?: any;
  supplierState?: any;
  product?: any;

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
      this.filterProduct(this.selectedProduct);
    } else if (this.selectedTypeByProduct) {
      this.filterProductsByType(this.selectedTypeByProduct);
    } else {
      this.loadGridProducts();
    }
    this.loadGridTypes();
    this.loadListProducts();
    this.loadListTypes();
    this.countSuppliers();

    setTimeout(() => {
      this.calculateCards();
    }, 200);
  }

  clear() {
    this.selectedProduct = null;
    this.selectedTypeByProduct = null;
    this.cardSupplier = false;
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

  countSuppliers(): void {
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.suppliersCard = data;
      if (this.suppliersCard && Array.isArray(this.suppliersCard)) {
        this.amountSuppliersCard = this.suppliersCard.length;
      } else {
        this.amountSuppliersCard = 0;
      }
    });
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
    this.selectedTypeByProduct = null;
    this.selectedProduct = product;
    const id = this.selectedProduct.id;
    this.productsService.filterProduct(id).subscribe(
      (data) => {
        this.products = [];
        this.products = data;
        if (this.products.length > 0) {
          this.cardSupplier = true;
          this.product = this.products[0];

          this.supplierName = this.product.supplier.name;
          this.supplierState = this.product.supplier.state;
          this.supplierCountry = this.product.supplier.country;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: 'filterProduct',
          detail: 'This Product Does Not Exist!',
        });
      }
    );
  }

  filterProductsByType(type: string): void {
    this.selectedProduct = null;
    this.selectedTypeByProduct = type;
    const id = this.selectedTypeByProduct.id;
    this.productsService.filterProductsByType(id).subscribe(
      (data) => {
        this.products = [];
        this.products = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: ' filterProductsByType',
          detail: 'There are no Products with this Type!',
        });
      }
    );
  }

  createProduct(): void {
    this.formProduct.reset();
    this.visibleFormProduct = true;
  }

  saveProduct(): void {
    if (this.formProduct.valid) {
      this.productsService.createProduct(this.formProduct.value).subscribe({
        complete: () => {
          this.visibleFormProduct = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            key: 'saveProduct',
            detail: 'Product Saved!',
          });
        },
      });
      this.calculateCards();
      setTimeout(() => {
        this.findAll();
      }, 1000);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        key: 'saveProduct',
        detail: 'Fill in all Required Fields before Saving.',
      });
    }
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
                summary: 'Success!',
                key: 'updateProduct',
                detail: updatedProduct.name + 'Edited!',
              });
              this.findAll();
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              key: 'updateProduct',
              detail: 'Error updating product!',
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        key: 'updateProduct',
        detail: 'Complete all Required Fields before Updating.',
      });
    }
  }

  openDeleteProduct(product: any) {
    this.selectedProductDelete = product;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'delete',
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
            summary: 'Success!',
            key: 'deleteProduct',
            detail:
              'Product ' + this.selectedProductDelete.name + ' Deleted...',
          });

          this.loadGridProducts();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            key: 'deleteProduct',
            detail: 'Error deleting product!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Canceled...',
        key: 'deleteProduct',
        detail: 'Exclusion has been Cancelled!',
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
    if (this.formType.valid) {
      this.productsService.createType(this.formType.value).subscribe({
        complete: () => {
          this.visibleFormType = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            key: 'saveType',
            detail: 'Product Type Saved!',
          });
          this.findAll();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            key: 'saveType',
            detail: 'Error saving product type!',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        key: 'saveType',
        detail: 'Fill in all Required Fields before Saving.',
      });
    }
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
              summary: 'Success!',
              key: 'updateType',
              detail: updatedType.name + ' Edited!',
            });
            this.findAll();
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            key: 'updateType',
            detail: 'Error updating Type!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        key: 'updateType',
        detail: 'Complete all Required Fields before Updating.',
      });
    }
  }

  openDeleteType(type: any) {
    this.selectedTypeDelete = type;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Delete',
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
            summary: 'Success!',
            key: 'deleteType',
            detail: this.selectedTypeDelete.name + ' ' + 'Deleted...',
          });
          setTimeout(() => {
            this.findAll();
          }, 2600);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            key: 'deleteType',
            detail: 'type in use!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Canceled...',
        key: 'deleteType',
        detail: 'Deletion has been canceled!',
      });
    }
  }
}
