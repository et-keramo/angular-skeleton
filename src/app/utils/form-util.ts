import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtil {

  public isInvalid(form: FormGroup, name: string, err?: string) {
    const formControl = form.get(name);
    const isFocus = formControl.dirty || formControl.touched;

    if (isFocus) {
      if (err) {
        return formControl.hasError(err) ? true : false;
      }
      return formControl.invalid;
    }
    return false;
  }

  public getErrors(form: FormGroup, name: string, err?: string) {
    if (err) {
      const formControl = form.get(name);
      return formControl.errors[err][err];
    }
    return false;
  }

}
