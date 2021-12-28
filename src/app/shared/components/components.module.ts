import { NgModule } from '@angular/core';
import { DataTableModule } from './data-table/data-table.module';
import { FormErrorModule } from './form-error/form-error.module';
import { FormFileInputModule } from './form-file-input/form-file.input.module';

@NgModule({
  imports: [
    DataTableModule,
    FormErrorModule,
    FormFileInputModule
  ],
  providers: [],
  exports: [
    DataTableModule,
    FormErrorModule,
    FormFileInputModule
  ]
})
export class ComponentsModule {}
