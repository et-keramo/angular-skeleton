import { NgModule } from '@angular/core';
import { ImageSecurePipeModule } from './image/image-secure-pipe.module';

@NgModule({
  imports: [
    ImageSecurePipeModule
  ],
  providers: [],
  exports: [
    ImageSecurePipeModule
  ]
})
export class PipesModule {}
