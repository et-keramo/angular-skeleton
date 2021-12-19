import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageSecurePipeModule } from '@shared/pipes/image/image-secure-pipe.module';
import { FormFileInputComponent } from './form-file-input.component';

@NgModule({
  declarations: [
    FormFileInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ImageSecurePipeModule
  ],
  exports: [
    FormFileInputComponent
  ]
})
export class FormFileInputModule {}
