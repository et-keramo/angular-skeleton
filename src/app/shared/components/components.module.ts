import { NgModule } from '@angular/core';
import { DataTableModule } from './data-table/data-table.module';
import { DataTreeTableModule } from './data-tree-table/data-tree-table.module';
import { FormErrorModule } from './form-error/form-error.module';
import { FormFileInputModule } from './form-file-input/form-file.input.module';

@NgModule({
  imports: [
    DataTableModule,
    DataTreeTableModule,
    FormErrorModule,
    FormFileInputModule
  ],
  providers: [],
  exports: [
    DataTableModule,
    DataTreeTableModule,
    FormErrorModule,
    FormFileInputModule
  ]
})
export class ComponentsModule {}
