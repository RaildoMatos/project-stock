import { Type } from './Type';

export interface Product {
  id?: number;
  name?: string;
  type?: Type;
  value?: number;
  supplier?: string;
  amount?: number;
  description?: string;
}
