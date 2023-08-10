import { Type } from './typeModel';

export interface Product {
  id?: number;
  name?: string;
  type?: Type;
  amount?: number;
  description?: string;
  price?: number;
}
