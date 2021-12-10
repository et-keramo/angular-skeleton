import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormErrorComponent {
  
  @Input() 
  public err: string;
  @Input()
  public max: number;
  @Input()
  public min: number;

  constructor() { }

  ngOnInit(): void { }

}
