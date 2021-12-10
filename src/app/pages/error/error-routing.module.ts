import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
  {
    path: 'not-authorized', // 401 Error
    component: NotAuthorizedComponent
  },
  {
    path: 'forbidden', // 403 Error
    component: ForbiddenComponent
  },
  {
    path: 'not-found', // 404 Error
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
