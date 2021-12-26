import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { TagInputModule } from 'ngx-chips';
import { DataTableComponent } from './data-table.component'

@NgModule({
  declarations: [
    DataTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    NgxDatatableModule,
    NgbDropdownModule,
    TagInputModule
  ],
  exports: [
    DataTableComponent
  ]
})
export class DataTableModule {}
