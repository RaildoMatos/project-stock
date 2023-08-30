export class Page {
  // content: T[];
  // totalElements: number;
  // totalPages: number;
  // number: number;
  // size: number;
  page: any;
  size: any;
  total?: number;
  sort?: string;
  direction?: string;

  constructor(page: any, size: any) {
    this.page = page;
    this.size = size;
  }
}
