import { SuppliersService } from 'src/app/services/suppliers.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { Supplier } from 'src/app/models/supplier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class SuppliersComponent implements OnInit {
  formSupplier!: FormGroup;
  suppliers: Supplier[] = [];
  listCategories: any[] = [];
  listSuppliers: any[] = [];
  selectedSupplier: any;
  editedSupplierId: any;
  selectedSupplierDelete: any;
  filteredCategory: any;
  filteredSupplier: any;
  selectedCategoryBySupplier: any;
  visibleFormSupplier: boolean = false;
  visibleEditFormSupplier: boolean = false;

  confirmationService = inject(ConfirmationService);
  suppliersService = inject(SuppliersService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.findAll();
    this.createFormNewSupplier();
  }

  findAll(): void {
    if (this.selectedSupplier) {
      this.filterSupplier(this.selectedSupplier);
    } else if (this.selectedCategoryBySupplier) {
      this.filterSuppliersByCategory(this.selectedCategoryBySupplier);
    } else {
      this.loadGridSupplier();
    }
    this.loadListSuppliers();
    this.loadListCategories();
  }

  loadGridSupplier() {
    this.suppliersService.getPaginatedListSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
  }

  loadListSuppliers() {
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.listSuppliers = data;
    });
  }

  loadListCategories() {
    this.suppliersService.getListCategories().subscribe((data) => {
      this.listCategories = data;
    });
  }

  clear() {
    this.selectedSupplier = null;
    this.selectedCategoryBySupplier = null;
    this.findAll();
  }

  createFormNewSupplier(): void {
    this.formSupplier = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      adress: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    });
  }

  loadFilterSupplier(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listSuppliers as any[]).length; i++) {
      let supplier = (this.listSuppliers as any[])[i];
      if (supplier.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(supplier);
      }
    }
    this.filteredSupplier = filtered;
  }

  loadFilterCategories(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listCategories as any[]).length; i++) {
      let category = (this.listCategories as any[])[i];
      if (category.category.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category);
      }
    }
    this.filteredCategory = filtered;
  }

  filterSupplier(supplier: string): void {
    this.selectedSupplier = null;
    this.selectedSupplier = supplier;
    const id = this.selectedSupplier.id;
    this.suppliersService.filterSupplier(id).subscribe(
      (data) => {
        if (data.length === 0) {
          // Verifica se o retorno está vazio
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'filterSupplier',
            detail: 'Não há Fornecedor!',
          });
        } else {
          this.suppliers = data;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: 'filterSupplier',
          detail: 'Fornecedor não Cadastrado.',
        });
      }
    );
  }

  filterSuppliersByCategory(supplier: string): void {
    this.selectedCategoryBySupplier = null;
    this.selectedCategoryBySupplier = supplier;
    const category = this.selectedCategoryBySupplier.category;
    this.suppliersService
      .filterSuppliersByCategory(category)
      .subscribe((data) => {
        if (data.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'filterSuppliersByCategory',
            detail: 'Não há Fornecedor com essa Categoria!',
          });
        } else {
          this.suppliers = data;
        }
      });
  }

  create(): void {
    this.formSupplier.reset();
    this.visibleFormSupplier = true;
  }

  save(): void {
    if (this.formSupplier.valid) {
      this.suppliersService.create(this.formSupplier.value).subscribe({
        complete: () => {
          this.visibleFormSupplier = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'saveSupplier',
            detail: 'Fornecedor Salvo!',
          });
          this.findAll();
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        key: 'saveSupplier',
        detail: 'Preencha todos os Campos Obrigatórios antes de Salvar.',
      });
    }
  }

  editSupplier(supplier: Supplier): void {
    this.formSupplier.patchValue({
      name: supplier.name,
      category: supplier.category,
      country: supplier.country,
      state: supplier.state,
      email: supplier.email,
      contact: supplier.contact,
      adress: supplier.adress,
      comments: supplier.comments,
    });

    this.editedSupplierId = supplier.id;
    this.visibleEditFormSupplier = true;
  }

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
            this.visibleEditFormSupplier = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              key: 'update',
              detail: updated.name + ' Atualizado!',
            });
            this.findAll();
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'update',
            detail: 'Erro ao Atualizar Fornecedor!',
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

  openDeleteSupplier(supplier: any) {
    this.selectedSupplierDelete = supplier;
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
      const supplierIdToDelete = this.selectedSupplierDelete.id;
      this.suppliersService.deleteSupplier(supplierIdToDelete).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'delete',
            detail:
              'Supplier ' + this.selectedSupplierDelete.name + ' Excluído...',
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
