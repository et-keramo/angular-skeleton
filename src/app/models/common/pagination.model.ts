export class Pagination {
  total: number;
  index: number;
  size: number;
  sort?: [{
    column: string;
    order: 'ASC' | 'DESC';
  }];
  operator?: 'AND' | 'OR';
  keywords?: string[];
  fromDate?: string;
  toDate?: string;

  constructor() {
    this.total = 0;
    this.operator = 'OR';
    this.keywords = [];
    this.index = 0;
    this.size = 10;
  }
}
