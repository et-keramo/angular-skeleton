import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthInfo } from '@model/auth/auth-info.model';
import { ResultMessage } from '@model/common/result-message.model';
import { AuthService } from '@service/auth/auth.service';
import { environment as env } from '@env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public authInfo: AuthInfo = new AuthInfo();
  public authErr: string;

  public passwordTextType: boolean;

  public loading: boolean = false;

  private HOME_URL = 'main/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem(env.USER_INFO)) {
      this.routeHome();
    }
  }

  ngOnDestroy(): void { }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  login() {
    this.loading = true;

    this.authService.login(this.authInfo)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((result: ResultMessage) => {
        if (result.success) {
          this.routeHome();
        } else {
          this.authErr = result.message;
        }
      }, err => {
        this.authErr = '로그인 시도 중 오류가 발생했습니다.';
        console.error(err);
      });
  }

  routeHome() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const routeUrl = returnUrl ? returnUrl : this.HOME_URL;

    this.router.navigate([routeUrl]).then(() => {
      this.authInfo.init();
      this.authErr = undefined;
    });
  }

}
