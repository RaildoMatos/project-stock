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
  nameSupplier?: any;
  stateCard?: any;
  adressCard?: any;
  emailCard?: any;
  contactCard?: any;
  commentCard?: any;
  showCards: any;
  selectedCategoryBySupplier: any;
  visibleFormSupplier: boolean = false;
  visibleEditFormSupplier: boolean = false;
  loading: boolean = false;

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
    setTimeout(() => {
      this.extractDataBySupplier();
    }, 200);
  }

  loadGridSupplier() {
    this.suppliersService.getPaginatedListSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
  }

  extractDataBySupplier() {
    if (this.suppliers && this.suppliers.length > 0) {
      this.nameSupplier = this.suppliers.map((supplier) => supplier.name);
      this.stateCard = this.suppliers.map((supplier) => supplier.state);
      this.adressCard = this.suppliers.map((supplier) => supplier.adress);
      this.emailCard = this.suppliers.map((supplier) => supplier.email);
      this.contactCard = this.suppliers.map((supplier) => supplier.contact);
      this.commentCard = this.suppliers.map((supplier) => supplier.comments);
    }
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
    this.showCards = false;
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
          this.showCards = false;
        } else {
          this.suppliers = data;
          this.showCards = true;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          key: 'filterSupplier',
          detail: 'not registered Supplier.',
        });
      }
    );
  }

  filterSuppliersByCategory(supplier: string): void {
    this.showCards = false;
    this.selectedCategoryBySupplier = null;
    this.selectedCategoryBySupplier = supplier;
    const category = this.selectedCategoryBySupplier.category;
    this.suppliersService
      .filterSuppliersByCategory(category)
      .subscribe((data) => {
        if (data.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            key: 'filterSuppliersByCategory',
            detail: 'There is no Supplier with this Category!',
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
            summary: 'Success!',
            key: 'saveSupplier',
            detail: 'Saved Supplier!',
          });
          this.findAll();
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        key: 'saveSupplier',
        detail: 'Fill in all Required Fields before Saving.',
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
              summary: 'Success!',
              key: 'update',
              detail: updated.name + ' Updated!',
            });
            this.findAll();
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            key: 'update',
            detail: 'Error updating Supplier!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        key: 'update',
        detail: 'Complete all Required Fields before Updating.',
      });
    }
  }

  openDeleteSupplier(supplier: any) {
    this.selectedSupplierDelete = supplier;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Delete',
      icon: 'pi pi-info-circle',
      key: 'delete',
    });
  }

  delete(confirmSupplier: boolean) {
    this.confirmationService.close();
    if (confirmSupplier) {
      const supplierIdToDelete = this.selectedSupplierDelete.id;
      this.suppliersService.delete(supplierIdToDelete).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            key: 'delete',
            detail:
              'Supplier ' + this.selectedSupplierDelete.name + ' Deleted...',
          });
          this.findAll();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'delete',
            detail: 'Supplier in Use!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Canceled...',
        key: 'delete',
        detail: 'Deletion has been canceled!',
      });
      this.findAll();
    }
  }
}
