import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'form-file-input',
  templateUrl: './form-file-input.component.html',
  styleUrls: ['./form-file-input.component.scss']
})
export class FormFileInputComponent implements OnInit {
  
  @ViewChild('inputFile') inputFile: ElementRef;

  @Input() 
  public multiple: boolean = false;
  @Input()
  public preview: boolean = false;

  @Output()
  public onChange: EventEmitter<any> = new EventEmitter();
  @Output()
  public onRemove: EventEmitter<any> = new EventEmitter();

  public inputId: any;

  public uploader: FileUploader = new FileUploader({ isHTML5: true });
  public dropOver: boolean = false;

  public files: any[] = [];
  public fileName: string;

  public previews: any[] = [];

  private removeFlag: boolean = false;

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.inputId = this.uuidEmit();
  }

  ngOnInit(): void {}

  public onFileOver($event: any) {
    this.dropOver = $event;
  }

  public onFileDrop($event: any) {
    const files = $event;

    if (files.length === 0) {
      return;
    }
    
    if (this.multiple) {
      Array.from(files).forEach((file: any) => {
        this.files.push(file);
        this.filePreview(file);
      }); 
    } else {
      this.clear();
      const file = files[0];
      this.files.push(file);
      this.filePreview(file);
    }
    
    this.uploader.clearQueue();

    this.onChange.emit({
      files: this.files
    });
  }

  public onDropZoneClick() {
    if (!this.removeFlag) {
      this.inputFile.nativeElement.click();
    }
  }

  public onFileSelected($event?: any) {
    const files = $event.target.files;

    if (files.length === 0) {
      return;
    }

    if (this.multiple) {
      Array.from(files).forEach((file: any) => {
        this.files.push(file);
        if (this.preview) {
          this.filePreview(file);
        }
      });
      this.fileName = this.files.map((f: any) => f.name).join(', ');
    } else {
      this.clear();
      const file = files[0];
      this.files.push(file);
      if (this.preview) {
        this.filePreview(file);
      }
      this.fileName = file.name;
    }
    
    this.inputFile.nativeElement.value = '';

    this.onChange.emit({
      files: this.files
    });
  }

  public onFileInputClick($event: any) {
    if (this.removeFlag) {
      $event.preventDefault();
    }
  }

  public filePreview(file: File) {
    const reader = new FileReader();

    const extIndex = file.name.lastIndexOf('.');
    const ext = file.name.substring(extIndex);
    const available = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'].includes(ext);

    if (available) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', d => {
        // Ignore XSS (Cross Site Scripting)
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string) as any;
        const safeUrlData = safeUrl.changingThisBreaksApplicationSecurity;
  
        // Convert image file to base64 string
        this.previews = [ ...this.previews, safeUrlData ];
      }, true);
    } else {
      this.previews = [ ...this.previews, 'assets/images/no_image.png' ];
    }
  }

  public addFile(data: any) {
    this.files.push({
      id: data.id,
      name: data.name
    });

    if (this.multiple) {
      this.fileName = this.files.map((f: any) => f.name).join(', ');
    } else {
      this.fileName = data.name;
    }

    this.previews.push(data.src);
  }

  public removeFile(index: number) {
    this.removeFlag = true;
    
    if (!(this.files[index] instanceof File)) {
      this.onRemove.emit({
        id: this.files[index].id,
        name: this.files[index].name
      });
    }

    this.files.splice(index, 1);
    this.previews.splice(index, 1);

    setTimeout(() => {
      this.removeFlag = false;
    });
  }

  private clear() {
    this.files.length = 0;
    this.previews.length = 0;
  }

  private uuidEmit() {
    const n = Date.now();
    const r = Math.random();
    const s = String(n) + String(~~(r*9e4)+1e4);
    return `${s.slice(0,8)}-${s.slice(8,12)}-4${s.slice(12,15)}-${[8,9,'a','b'][~~(r*3)]}${s.slice(15,18)}-${s.slice(s.length-12)}`;
  }

}
