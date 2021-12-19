import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { environment as env } from '@env/environment';

@Pipe({
  name: 'image'
})
export class ImageSecurePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  async transform(url: string, file?: any) {
    if (url === undefined || url.indexOf(';base64,') >= 0) {
      return url;
    }

    const token = localStorage.getItem(env.USER_TOKEN);

    const options = {
      headers: new HttpHeaders().set('Authorization', token),
      responseType: 'blob'
    } as any;

    let request;

    if (file instanceof File) {
      return url;
    } else {
      if (typeof file.id === 'object') {
        options.headers = options.headers.set('Content-Type', 'application/json');
        request = this.http.post(url, JSON.stringify(file.id), options);
      } else {
        request = this.http.get(url, options);
      }
    }

    return new Promise((resolve, reject) => {
      request.subscribe(response => {
        const reader = new FileReader();

        reader.readAsDataURL(response as any);
        reader.addEventListener('load', d => {
          // Ignore XSS (Cross Site Scripting)
          const safeUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string) as any;
          const safeUrlData = safeUrl.changingThisBreaksApplicationSecurity;
          resolve(safeUrlData as string);
        }, true);

      }, err => {
        console.error(err);
        resolve('/assets/images/no_image.png');
      });
    });
  }
  
}