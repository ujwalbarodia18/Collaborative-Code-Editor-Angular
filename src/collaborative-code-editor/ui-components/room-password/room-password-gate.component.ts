import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from "../../form-components/text-input/text-input.component";
import { UiButtonComponent } from "../../form-components/ui-button/ui-button.component";

@Component({
  selector: 'app-room-password',
  imports: [FormsModule, TextInputComponent],
  templateUrl: './room-password-gate.component.html',
  styleUrl: './room-password-gate.component.scss',
})
export class RoomPasswordComponent {
  @Input() error = false;
  @Output() submit = new EventEmitter<string>();

  password: string = '';

  onSubmit() {
    if (!this.password.trim()) return;
    this.submit.emit(this.password);
  }
}
