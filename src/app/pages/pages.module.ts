import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { MainModule } from './main/main.module';
import { ErrorModule } from './error/error.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    MainModule,
    ErrorModule
  ]
})
export class PagesModule { }
