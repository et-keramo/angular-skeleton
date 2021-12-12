import { Injectable } from '@angular/core';
import { SwalInfo } from '@model/common/swal-info.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalGenerator {

  constructor() {}

  // Success
  public success(target: string, job: string, message?: string) {
    Swal.fire({
      title: `${target} ${job} 성공`,
      text: message,
      icon: 'success',
      confirmButtonText: '확인'
    });
  }

  public successGet(target: string, message: string) {
    this.success(target, '조회', message);
  }

  public successAdd(target: string, message: string) {
    this.success(target, '등록', message);
  }

  public successUpdate(target: string, message: string) {
    this.success(target, '수정', message);
  }

  public successDelete(target: string, message: string) {
    this.success(target, '삭제', message);
  }

  // Fail & Error
  public fail(target: string, job: string, error: boolean, message?: string) {
    const title = error ? `${target} ${job} 오류 발생` : `${target} ${job} 실패`;

    const swalFireInfo = {
      title,
      icon: 'error',
      confirmButtonText: '확인'
    } as any;

    if (message) {
      swalFireInfo.text = message;
    }

    Swal.fire(swalFireInfo);
  }

  public failGet(target: string, message: string) {
    this.fail(target, '조회', false, message);
  }

  public failAdd(target: string, message: string) {
    this.fail(target, '등록', false, message);
  }

  public failUpdate(target: string, message: string) {
    this.fail(target, '수정', false, message);
  }

  public failDelete(target: string, message: string) {
    this.fail(target, '삭제', false, message);
  }
  
  public errorGet(target: string, message: string) {
    this.fail(target, '조회', true, message);
  }

  public errorAdd(target: string, message: string) {
    this.fail(target, '등록', true, message);
  }

  public errorUpdate(target: string, message: string) {
    this.fail(target, '수정', true, message);
  }

  public errorDelete(target: string, message: string) {
    this.fail(target, '삭제', true, message);
  }

  // Confirm
  public confirm(info: SwalInfo, title: string, message: string) {
    Swal.fire({
      title,
      html: message,
      icon: 'question',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return info.request();
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result: any) => {
      if (result.value) {
        info.callback();
      }
    });
  }

  // Delete Confirm
  public deleteConfirm(info: SwalInfo) {
    Swal.fire({
      title: `${info.target} 삭제`,
      html: `${info.target} 을(를) 정말 삭제하시겠습니까?`,
      icon: 'warning',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return info.request();
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result: any) => {
      if (result.value) {
        info.callback();
      }
    });
  }

}
