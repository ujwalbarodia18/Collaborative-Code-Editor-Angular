import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-dialog',
  imports: [],
  templateUrl: './ui-dialog.component.html',
  styleUrl: './ui-dialog.component.scss',
  standalone: true
})
export class UiDialogComponent {
  @Input() header: string = "Header";
  @Output() closeDialog = new EventEmitter<void>();

  onClose() {
    this.closeDialog.emit();
  }
}
