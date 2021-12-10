import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'main',
        canActivate: [ AuthGuard ],
        loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule)
      },
      {
        path: 'error',
        canActivate: [ AuthGuard ],
        loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/error/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }