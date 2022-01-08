import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { TagInputComponent } from 'ngx-chips';
import { TreeFilter } from './tree-filter';
import { Pagination } from '@model/common/pagination.model';
import { PaginationSort } from '@model/common/pagination-sort.model';
import { ResultMessage } from '@model/common/result-message.model';
import { SwalGenerator } from '@util/swal-generator';
import { DateUtil } from '@util/date-util';
import { TREE_STATUS } from '@app/global';

@Component({
  selector: 'app-data-tree-table',
  templateUrl: './data-tree-table.component.html',
  styleUrls: [
    '../data-table/data-table.component.scss',
    './data-tree-table.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class DataTreeTableComponent implements OnInit {
  
  @ViewChild('tagInput') tagInput: TagInputComponent;

  // Title
  @Input()
  public subject: string;

  // API Service
  @Input()
  public apiService: any;

  // Table Option
  @Input()
  public id: string;
  @Input()
  public columns: any;
  @Input()
  public displayColumns: string[] = [];
  @Input()
  public defaultSort: PaginationSort[] = [];

  // Tree Table Option
  @Input()
  public parent: string = 'pid';
  @Input()
  public leaf: string = 'id';

  // Search Option
  @Input()
  public searchKeyword: boolean = true;
  @Input()
  public searchDate: boolean = true;

  // Button Option
  @Input()
  public btnDelete: boolean = true;
  @Input()
  public buttonColumns: any[] = [];

  // Modal
  @Input()
  public addModal;
  @Input()
  public detailModal;
  @Input()
  public updateModal;


  @Output()
  public onDataLoad: EventEmitter<any> = new EventEmitter<any>();

  public columnMode: string = ColumnMode.flex;
  public selectionType: string = this.btnDelete ? SelectionType.checkbox : null;

  public pagination: Pagination = new Pagination();
  
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;

  public rows: any[] = [];
  public filterRows: any[] = [];
  public selectRows: any[] = [];

  public emptyMessage: string = '데이터가 없습니다.';

  public loading: boolean = false;

  private inputKeyword: string;

  constructor(
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private treeFilter: TreeFilter,
    private swalGenerator: SwalGenerator,
    private dateUtil: DateUtil
  ) {
    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
    this.toDate = this.calendar.getToday();

    this.inputKeyword = '';
  }
  
  ngOnInit(): void {
    this.pagination = new Pagination(this.defaultSort);

    if (this.searchDate) {
      this.pagination.fromDate = this.dateUtil.format(this.fromDate, 'YYYY-MM-DD');
      this.pagination.toDate = this.dateUtil.format(this.toDate, 'YYYY-MM-DD');
    }

    this.onFetch();
  }

  // Fetch
  public onFetch() {
    return new Promise<void>((resolve, reject) => {
      this.loading = true;

      this.apiService.list().subscribe((result: ResultMessage) => {
        if (result.success) {
          this.makeTree(result.data).then(() => {
            this.onDataLoad.emit({
              data: this.filterRows,
              count: this.filterRows.length
            });
          });

          this.selectRows.length = 0;
          this.emptyMessage = '데이터가 없습니다.';

          this.loading = false;
          resolve();
        } else {
          this.emptyMessage = '데이터를 불러오는데 실패했습니다.';
          this.loading = false;
          reject(new Error(result.message));
        }
      }, err => {
        this.emptyMessage = '데이터를 불러오는 중 오류가 발생했습니다.';
        this.loading = false;
        reject(err);
      });
    });
  }

  public onTree($event: any) {
    const row = $event.row;

    if (row.treeStatus === TREE_STATUS.COLLAPSED) {
      row.treeStatus = TREE_STATUS.EXPANDED;
    } else {
      row.treeStatus = TREE_STATUS.COLLAPSED;
    }
    
    this.filterRows = [...this.filterRows];
  }

  public onSort($event: any) {
    this.pagination.sort = $event.sorts;
  }

  public reload() {
    this.onFetch().then(() => {
      this.filterRows.forEach(row => {
        this.expandParent(row);
      });

      this.filterRows = [...this.filterRows];
    });
  }

  // Date Search
  public onDateSelect(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  public isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  public isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  public isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  // Keyword Search
  public toggleOperator() {
    this.pagination.operator = this.pagination.operator === 'AND' ? 'OR' : 'AND';
  }

  public onKeyup($event: any) {
    if ($event.keyCode === 13 || $event.keyCode === 32) {
      this.search();
    } else {
      this.inputKeyword = $event.target.value;
    }
  }

  public search() {
    if (this.inputKeyword) {
      const keyword = this.inputKeyword.trim();

      if (keyword.length === 0) {
        const value = this.tagInput.inputForm.value.value;
        this.tagInput.inputForm.value.setValue(value.substring(0, value.length - 1));
        return;
      }

      if (keyword) {
        const found = this.pagination.keywords.find(e => {
          return e === keyword;
        });

        if (!found) {
          this.pagination.keywords.push(keyword);
        }
        
        this.inputKeyword = '';
        this.tagInput.inputForm.value.setValue('');
      }
    }
    
    this.reload();
  }

  // Delete
  public onSelect($event: any) {
    if ($event.selected) {
      this.selectRows.length = 0;
      this.selectRows.push(...$event.selected);
    }
  }

  public onCheck(data: any, checked: boolean) {
    const children = this.filterRows.filter(row => {
      return row[this.parent] === data[this.leaf];
    });

    children.forEach(child => {
      if (checked) {
        data.treeStatus = TREE_STATUS.EXPANDED;
      }
      this.checkChild(child, checked);
    });
      
    this.filterRows = [...this.filterRows];
  }

  public delete() {
    const found = this.filterRows.find(row => {
      return row[this.parent] === row[this.leaf];
    });

    if (found) {
      this.swalGenerator.failDelete(this.subject, `상위 ${this.subject}이(가) 존재합니다.`);
      return;
    }

    this.swalGenerator.deleteConfirm({
      target: this.subject,
      request: () => {
        return new Promise((resolve, reject) => {
          this.apiService.delete(this.selectRows).subscribe((result: ResultMessage) => {
            if (result.success) {
              resolve(result);
            } else {
              this.swalGenerator.failDelete(this.subject, result.message);
              reject(new Error(result.message));
            }
          }, err => {
            this.swalGenerator.errorDelete(this.subject, err.message);
            reject(err);
          });
        });
      },
      callback: () => {
        this.onFetch();
      }
    });
  }

  // Private
  private makeTree(list: any[]) {
    return new Promise<void>(resolve => {
      // Make Tree Map
      const rowMap = {};
      this.rows = list.map(row => {
        row.treeStatus = TREE_STATUS.COLLAPSED;
        rowMap[row[this.leaf]] = row;
        return row;
      });

      // Tagging Parent & Leaf
      this.rows = this.rows.map(row => {
        const found = this.rows.find(r => {
          return r[this.parent] === row[this.leaf];
        });
        
        // Last Leaf
        if (!found) {
          row.treeStatus = TREE_STATUS.DISABLED;
        }

        row.parent = rowMap[row[this.parent]];
        return row;
      });

      // Search
      this.filterRows.length = 0;

      this.rows.forEach(row => {
        if (this.treeFilter.execute(this.pagination, row)) {
          this.filterRows.push(row);
        }
      });

      this.filterRows = [...this.filterRows];

      resolve();
    });
  }

  private expandParent(data: any) {
    if (data.parent) {
      const found = this.filterRows.find(row => {
        return row[this.leaf] === data.parent[this.leaf];
      });

      if (!found) {
        data.parent.treeStatus = TREE_STATUS.EXPANDED;
        this.filterRows.push(data.parent);
        this.expandParent(data.parent);
      }
    }
  }

  private checkChild(data: any, checked: boolean) {
    if (checked) {
      this.selectRows.push(data);
    } else {
      const index = this.selectRows.findIndex(row => {
        return row[this.leaf] === data[this.leaf];
      });
      this.selectRows.splice(index, 1);
    }

    const children = this.filterRows.filter(row => {
      return row[this.parent] === data[this.leaf];
    });

    children.forEach(child => {
      if (checked) {
        data.treeStatus = TREE_STATUS.EXPANDED;
      }
      this.checkChild(child, checked);
    });
  }
  
}
