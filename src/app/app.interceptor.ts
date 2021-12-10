import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment as env } from '@env/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.handle(request, next)).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

   /**
   * Handle request
   * @param request
   * @param next
   */
    async handle(request: HttpRequest<any>, next: HttpHandler) {
      const token = localStorage.getItem(env.USER_TOKEN);
  
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: token
          }
        });
      }
      return next.handle(request).toPromise();
    }
  
    /**
     * Handle authorization error
     * @param err
     */
    handleError(err: HttpErrorResponse): Observable<any> {
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem(env.USER_TOKEN);
        localStorage.removeItem(env.USER_INFO);
        this.router.navigate(['/auth/login']);
      }
      return throwError(err);
    }
}
