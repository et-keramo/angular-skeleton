import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { ResultMessage } from '@model/common/result-message.model';
import { AuthInfo } from '@model/auth/auth-info.model';
import { environment as env } from '@env/environment';

const BASE_PATH = 'auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  public currentUser: Observable<any>;

  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(env.USER_INFO)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(authInfo: AuthInfo): Observable<ResultMessage> {
    return new Observable((observer: Observer<ResultMessage>) => {
      this.http.post(`${env.API_URL}/${BASE_PATH}/login`, authInfo, { observe: 'response' }).subscribe((response: HttpResponse<any>) => {
        const result: ResultMessage = response.body;

        if (result.success) {
          const token = response.headers.get('Authorization');
          localStorage.setItem(env.USER_TOKEN, token);
        }
        observer.next(result);
      }, err => {
        observer.error(err);
      });
    });
  }

  validate(): Observable<ResultMessage> {
    return new Observable((observer: Observer<ResultMessage>) => {
      this.http.get(`${env.API_URL}/${BASE_PATH}/validate`).subscribe((result: ResultMessage) => {
        if (result.success) {
          if (!localStorage.getItem(env.USER_INFO)) {
            const user = result.data.user;
            localStorage.setItem(env.USER_INFO, JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }
        observer.next(result);
      }, err => {
        observer.error(err);
      });
    });
  }

  logout(): Observable<any> {
    localStorage.removeItem(env.USER_TOKEN);
    localStorage.removeItem(env.USER_INFO);
    return this.http.get(`${env.API_URL}/${BASE_PATH}/logout`);
  }

}
