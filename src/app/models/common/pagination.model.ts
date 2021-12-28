import { PaginationSort } from "./pagination-sort.model";

export class Pagination {
  total: number;
  index: number;
  size: number;
  sort?: PaginationSort[];
  operator?: 'AND' | 'OR';
  keywords?: string[];
  fromDate?: string;
  toDate?: string;

  constructor(defaultSort?: PaginationSort[], defaultPageSize?: number) {
    this.total = 0;
    this.operator = 'OR';
    this.keywords = [];
    this.index = 0;

    if (defaultSort?.length > 0) {
      this.sort = defaultSort as any;
    }

    this.size = defaultPageSize ? defaultPageSize : 10;
  }

}
