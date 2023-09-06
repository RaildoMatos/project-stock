import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Page } from '../models/page';
import { Product } from '../models/product';
import { Type } from '../models/type';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_STOCK_PRODUCTS = 'http://localhost:8080/products';
  private API_STOCK_TYPES = 'http://localhost:8080/types';

  http = inject(HttpClient);

  // PRODUCTS:

  getListProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_STOCK_PRODUCTS);
  }

  getPaginatedListProducts() {
    return this.http.get<Product[]>(`${this.API_STOCK_PRODUCTS}/products`);
  }

  filterProduct(id: string | number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_STOCK_PRODUCTS}/${id}`);
  }

  filterProductsByType(id: string | number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_STOCK_PRODUCTS}/type/${id}`);
  }

  createProduct(data: Product) {
    return this.http.post<Product>(this.API_STOCK_PRODUCTS, data);
  }

  updateProduct(id: number, data: Product) {
    return this.http.put(`${this.API_STOCK_PRODUCTS}/${id}`, data);
  }

  deleteProduct(id: string | number) {
    return this.http.delete(`${this.API_STOCK_PRODUCTS}/${id}`, {
      responseType: 'text',
    });
  }

  getGraphAmountByType(): Observable<any> {
    return this.http.get<any>(`${this.API_STOCK_PRODUCTS}/types-amount`);
  }

  getGraphValuesByType(): Observable<any> {
    return this.http.get<any>(`${this.API_STOCK_PRODUCTS}/types-values`);
  }

  getGraphProductsValues(): Observable<any> {
    return this.http.get<any>(`${this.API_STOCK_PRODUCTS}/products-values`);
  }

  findProductValue(id: string | number): Observable<number> {
    const url = `${this.API_STOCK_PRODUCTS}/product-value/${id}`;
    return this.http.get<number>(url);
  }

  // TYPES:

  getListTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(this.API_STOCK_TYPES);
  }

  getPaginatedListTypes() {
    return this.http.get<Type[]>(`${this.API_STOCK_TYPES}/types`);
  }

  filterType(id: string | number): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.API_STOCK_TYPES}/${id}`);
  }

  createType(data: Type) {
    return this.http.post<Type>(this.API_STOCK_TYPES, data);
  }

  updateType(id: number, data: Type) {
    return this.http.put(`${this.API_STOCK_TYPES}/${id}`, data);
  }

  deleteType(id: string | number) {
    return this.http.delete(`${this.API_STOCK_TYPES}/${id}`, {
      responseType: 'text',
    });
  }
}
