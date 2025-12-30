import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-component-wrapper',
  imports: [],
  templateUrl: './form-component-wrapper.html',
  styleUrl: './form-component-wrapper.scss',
})
export class FormComponentWrapper {
  @Input() label: string = '';
  @Input() required: boolean = false;
}
