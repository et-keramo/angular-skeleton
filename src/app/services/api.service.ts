import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment as env } from '@env/environment';

const BASE_URL = env.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(private httpClient: HttpClient) {}

  public get(path: string, params: HttpParams = new HttpParams(), external?: boolean): Observable<any> {
    path = external === true ? path : this.getUrl(path);
    return this.httpClient.get(path, { params }).pipe(catchError(this.formatErrors));
  }

  public put(path: string, body: object = {}, external?: boolean): Observable<any> {
    path = external === true ? path : this.getUrl(path);
    return this.httpClient.put(path, JSON.stringify(body), this.options).pipe(catchError(this.formatErrors));
  }

  public post(path: string, body: object = {}, external?: boolean): Observable<any> {
    path = external === true ? path : this.getUrl(path);
    return this.httpClient.post(path, JSON.stringify(body), this.options).pipe(catchError(this.formatErrors));
  }

  public delete(path: string, params: HttpParams = new HttpParams(), external?: boolean): Observable<any> {
    path = external === true ? path : this.getUrl(path);
    const flag = Object.keys(params).length === 1 && Object.keys(params).find(value => value === 'id') !== undefined;
    if (flag) {
      return this.httpClient.delete(path, { params }).pipe(catchError(this.formatErrors));
    } else {
      return this.httpClient.request('delete', path, { body: params }).pipe(catchError(this.formatErrors));
    }
  }

  public upload(path: string, formData: any, external?: boolean): Observable<any> {
    path = external === true ? path : this.getUrl(path);
    return this.httpClient.post(path, formData).pipe(catchError(this.formatErrors));
  }
  
  public getUrl(path: string) {
    return `${BASE_URL}/${path}`;
  }

  private formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }

}
