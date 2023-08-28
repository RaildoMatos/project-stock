import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private API_STOCK_SUPPLIERS = 'http://localhost:8080/suppliers';

  http = inject(HttpClient);

  getListSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.API_STOCK_SUPPLIERS);
  }

  getPaginatedListSuppliers(page: Page) {
    return this.http.get<any>(
      `${this.API_STOCK_SUPPLIERS}/suppliers?page=${page.page}&size=${page.size}`
    );
  }

  filterSupplier(id: string | number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.API_STOCK_SUPPLIERS}/${id}`);
  }

  filterSuppliersByCategory(category: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(
      `${this.API_STOCK_SUPPLIERS}/category/${category}`
    );
  }

  create(data: Supplier) {
    return this.http.post<Supplier>(this.API_STOCK_SUPPLIERS, data);
  }

  update(data: Supplier) {
    return this.http.put(this.API_STOCK_SUPPLIERS, data);
  }

  delete(id: string | number) {
    return this.http.delete(`${this.API_STOCK_SUPPLIERS}/${id}`, {
      responseType: 'text',
    });
  }

  getGraphAmountByStates(): Observable<any> {
    return this.http.get<any>(`${this.API_STOCK_SUPPLIERS}/amount-state`);
  }

  getGraphAmountByCategory(): Observable<any> {
    return this.http.get<any>(`${this.API_STOCK_SUPPLIERS}/amount-category`);
  }

  getGraphAmountByProducts(): Observable<any> {
    return this.http.get<any>(`${this.API_STOCK_SUPPLIERS}/amount-products`);
  }
}
