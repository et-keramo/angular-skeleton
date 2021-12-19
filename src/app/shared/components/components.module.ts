import { NgModule } from '@angular/core';
import { FormErrorModule } from './form-error/form-error.module';
import { FormFileInputModule } from './form-file-input/form-file.input.module';

@NgModule({
  imports: [
    FormErrorModule,
    FormFileInputModule
  ],
  providers: [],
  exports: [
    FormErrorModule,
    FormFileInputModule
  ]
})
export class ComponentsModule {}
