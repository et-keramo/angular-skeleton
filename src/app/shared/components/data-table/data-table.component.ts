import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { TagInputComponent } from 'ngx-chips';
import { Pagination } from '@model/common/pagination.model';
import { PaginationSort } from '@model/common/pagination-sort.model';
import { ResultMessage } from '@model/common/result-message.model';
import { SwalGenerator } from '@util/swal-generator';
import { DateUtil } from '@util/date-util';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit {
  
  @ViewChild('tagInput') tagInput: TagInputComponent;

  // Title
  @Input()
  public subject: string;

  // API Service
  @Input()
  public apiService: any;
  @Input()
  public select: any;

  // Table Option
  @Input()
  public id: string;
  @Input()
  public columns: any;
  @Input()
  public displayColumns: string[] = [];
  @Input()
  public defaultPageSize: number = 10;
  @Input()
  public defaultSort: PaginationSort[] = [];

  // Search Option
  @Input()
  public searchDate: boolean = true;
  @Input()
  public searchKeyword: boolean = true;
    
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
  public selectionType: string = this.btnDelete ? SelectionType.checkbox : undefined;
  
  public pagination: Pagination = new Pagination();
  public pageSizeList: number[] = [ 5, 10, 15, 25, 50, 100 ];
  
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;

  public rows: any[] = [];
  public selectRows: any[] = [];

  public emptyMessage: string = '데이터가 없습니다.';

  public loading: boolean = false;

  private inputKeyword: string;

  constructor(
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private swalGenerator: SwalGenerator,
    private dateUtil: DateUtil
  ) {
    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
    this.toDate = this.calendar.getToday();

    this.inputKeyword = '';
  }
  
  ngOnInit(): void {
    this.pagination = new Pagination(this.defaultSort, this.defaultPageSize);

    if (this.searchDate) {
      this.pagination.fromDate = this.dateUtil.format(this.fromDate, 'YYYY-MM-DD');
      this.pagination.toDate = this.dateUtil.format(this.toDate, 'YYYY-MM-DD');
    }
    
    this.onFetch();
  }

  // Load
  public onFetch() {
    return new Promise<void>((resolve, reject) => {
      this.loading = true;

      this.apiService.listPage(this.pagination, this.select).subscribe((result: ResultMessage) => {
        if (result.success) {
          this.pagination.total = result.data.totalElements;
          this.rows = result.data.list;
          this.selectRows.length = 0;
          this.emptyMessage = '데이터가 없습니다.';

          this.onDataLoad.emit({
            data: this.rows,
            count: this.pagination.total
          });
          
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

  public onChangePage($event: any) {
    this.pagination.index = $event.page - 1;
    this.onFetch();
  }

  public onSort($event: any) {
    this.pagination.sort = $event.sorts;
    this.onFetch();
  }

  public reload() {
    this.pagination.index = 0;
    this.onFetch();
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

  public delete() {
    this.swalGenerator.deleteConfirm({
      target: this.subject,
      request: () => {
        return new Promise<any>((resolve, reject) => {
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

}
