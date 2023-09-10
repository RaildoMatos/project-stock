import { SuppliersService } from 'src/app/services/suppliers.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { Supplier } from 'src/app/models/supplier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page } from 'src/app/models/page';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, switchMap } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class SuppliersComponent implements OnInit {
  productsSuppliers: Supplier[] = [];
  list: Supplier[] = [];
  formSupplier!: FormGroup;
  selectedSupplier: Supplier[] = [];
  editedSupplierId: any;
  viewInfoSupplier?: Supplier[];

  filteredSupplier: any;
  formCategory!: FormGroup;
  visibleFormProduct: boolean = false;
  visibleEditFormProduct: boolean = false;
  suppliersService = inject(SuppliersService);
  valueProductsCard: number = 0;
  amountProductsCard: number = 0;
  amountSuppliersCard: number = 0;
  suppliersCard: Supplier[] = [];
  cardSupplier: boolean = false;
  selectedCategoryBySupplier: any;
  category: any;
  selectedCategory: any;
  editedCategory: any;
  suppliers: Supplier[] = [];
  page!: Page;
  buttonClearDisable?: boolean;
  viewVisible: { [key: string]: boolean } = {};

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  fb = inject(FormBuilder);
  supplierName?: any;
  supplierCountry?: any;
  supplierState?: any;
  product?: any;
  createFormNewProduct: any;
  listSuppliers: any[] | undefined;
  visibleEditFormSupplier: boolean = false;
  visibleEditFormCategory: boolean = false;
  listCategory?: any[];
  filteredCategory!: any[];

  ngOnInit(): void {
    this.findAll();
    this.createFormNewSupplier();
  }

  findAll(): void {
    if (this.selectedSupplier) {
      this.buttonClearDisable = false;
      this.filteredSupplier(this.selectedSupplier);
    } else if (this.selectedSupplier) {
      this.buttonClearDisable = false;
    } else {
      this.buttonClearDisable = true;
      this.loadGridSupplier();
    }

    this.loadListSupplier();

    this.countSuppliers();
  }
  loadListSupplier() {
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.listSuppliers = data;
    });
  }
  loadGridSupplier() {}

  clear() {
    this.cardSupplier = false;
    this.findAll();
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

  createFormNewSupplier(): void {
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
    this.formSupplier = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],

      contact: ['', [Validators.required]],
      email: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      adress: ['', [Validators.required]],
      category: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    });
  }

  /* loadGridSuppliers(): void {
    this.suppliersService
    getPaginatedListSuppliers()
     .subscribe((data: Supplier[]) => {
        this.suppliers = data;
      });
  }*/

  loadListSuppliers(): void {}

  loadFilterSupplier(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listSuppliers as any[]).length; i++) {
      let product = (this.listSuppliers as any[])[i];
      if (product.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.filteredSupplier = filtered;
  }

  filterSupplier(supplier: any): void {
    const id = supplier.id;
    this.suppliersService.filterSupplier(id).subscribe(
      (filteredSuppliers: any) => {
        if (filteredSuppliers.length > 0) {
          this.cardSupplier = true;
          this.selectedSupplier = filteredSuppliers;
          this.product = filteredSuppliers[0];

          this.supplierName = this.product.name;
          this.supplierState = this.product.state;
          this.supplierCountry = this.product.country;
        } else {
          this.cardSupplier = false;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: 'filterSupplier',
          detail: 'Erro ao filtrar fornecedor!',
        });
      }
    );
  }

  filterSuppliersByCategory(Product: string): void {
    this.suppliersService.filterSuppliersByCategory(Product).subscribe(
      (data: any) => {
        this.suppliers = data;
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: 'filterSupplierbyProducts',
          detail: 'Não há Fornecedor com esta Categoria!',
        });
      }
    );
  }
  loadFilterCategory(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listCategory as any[]).length; i++) {
      let category = (this.listCategory as any[])[i];
      if (category.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category);
      }
    }
    this.filteredCategory = filtered;
  }

  create(): void {
    this.formSupplier.reset();
    this.visibleFormProduct = true;
  }

  saveSupplier(): void {
    if (this.formSupplier.valid) {
      this.suppliersService.create(this.formSupplier.value).subscribe({
        complete: () => {
          this.visibleEditFormSupplier = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'saveSupplier',
            detail: 'Fornecedor Salvo!',
          });
          this.findAll();
        },
      });
      this.calculateCards();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        key: 'saveSupplier',
        detail: 'Preencha todos os Campos Obrigatórios antes de Salvar.',
      });
    }
  }
  calculateCards() {
    throw new Error('Method not implemented.');
  }

  /*editSupplier(Supplier: Supplier): void {
    this.formSupplier.patchValue({
      name: Supplier.name,
      amount: Supplier.amount,

      description: Supplier.description,
    });
    this.editedSupplierId = Supplier.id;
    this.visibleEditFormProduct = true;
  }*/

  update(): void {
    if (this.formSupplier.valid && this.editedSupplierId !== null) {
      const updated: Supplier = {
        id: this.editedSupplierId,
        ...this.formSupplier.value,
      };

      this.suppliersService.update(this.editedSupplierId, updated).subscribe(
        (response: any) => {
          if (
            response &&
            response.message === 'Supplier updated successfully!'
          ) {
            this.visibleEditFormProduct = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              key: 'update',
              detail: updated.name + ' Editado!',
            });
            this.findAll();
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'updateProduct',
            detail: 'Erro ao atualizar Fornecedor!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        key: 'update',
        detail: 'Preencha todos os Campos Obrigatórios antes de Atualizar.',
      });
    }
  }

  openDeleteSupplier(Supplier: any) {
    this.selectedSupplier = Supplier;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Excluir',
      icon: 'pi pi-info-circle',
      key: 'delete',
    });
  }

  delete(confirmSupplier: boolean) {
    this.confirmationService.close();
    if (confirmSupplier) {
      const SupplierIdToDelete = this.selectedSupplier[0].id;
      this.suppliersService.deleteSupplier(SupplierIdToDelete).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'deleteSupplier',
            detail:
              'Supplier ' + this.selectedSupplier[0].name + ' Excluído...',
          });

          this.loadGridSupplier();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'delete',
            detail: 'Erro ao excluir Fornecedor!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelou...',
        key: 'delete',
        detail: 'A Exclusão foi Cancelada!',
      });
      this.loadGridSupplier();
    }
  }
}
