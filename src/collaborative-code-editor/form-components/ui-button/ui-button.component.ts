import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  @Input() label: string = 'Submit';
  @Input() loadingText: string = 'Loading...';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() btnType: 'primary' | 'outline' = 'primary';

  @Output() btnClick = new EventEmitter<void>();

  onClick() {
    if (!this.isLoading && !this.disabled) {
      this.btnClick.emit();
    }
  }
}
