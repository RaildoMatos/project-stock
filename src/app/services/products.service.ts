import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/productModel';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_STOCK_PRODUCTS = 'http://localhost:8080/products';

  http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_STOCK_PRODUCTS);
  }

  create(data: Product) {
    return this.http.post<Product>(this.API_STOCK_PRODUCTS, data);
  }

  // update(data: Product) {
  //   return this.http.put(this.API_STOCK, data);
  // }

  // delete(id: string) {
  //   return this.http.delete(`${this.API_STOCK}/${id}`,{responseType: 'text'});
  // }
}
