export class PaginationSort {
  prop: string;
  dir: 'ASC' | 'DESC';

  constructor(prop: string, dir?: 'ASC' | 'DESC') {
    this.prop = prop;
    this.dir = dir ? dir : 'ASC';
  }

}
