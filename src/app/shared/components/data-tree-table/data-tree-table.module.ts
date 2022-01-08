import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { TagInputModule } from 'ngx-chips'
import { DataTreeTableComponent } from './data-tree-table.component'

@NgModule({
  declarations: [
    DataTreeTableComponent
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
    DataTreeTableComponent
  ]
})
export class DataTreeTableModule {}
