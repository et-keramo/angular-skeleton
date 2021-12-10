import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloader {

  public download(name: string, data: any) {
    const content = this.base64ToArrayBuffer(data);
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', name);
    link.click();
  }

  private base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }

}