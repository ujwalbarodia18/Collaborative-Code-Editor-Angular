import { Component, DestroyRef, Input, OnChanges, Optional, Self, SimpleChanges, ViewChild } from '@angular/core';
import { FormComponentWrapper } from '../form-component-wrapper/form-component-wrapper';
import { ControlValueAccessor, NgControl, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'ui-text-input',
  imports: [FormComponentWrapper, ɵInternalFormsSharedModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  standalone: true
})
export class TextInputComponent implements ControlValueAccessor, OnChanges{
  constructor(@Optional() @Self() public ngControl: NgControl, private destroyRef: DestroyRef) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @Input() label: string = "";
  @Input() type: 'text' | 'password' | 'email' | 'textarea' | 'number' = 'text';
  @Input() placeholder: string = "";
  @Input() takeRequiredFromControl: boolean = true;
  @Input() disabled: boolean = false;
  @Input() takeRequiredFromFormControl: boolean = true;
  @Input() required: boolean = false;
  @Input() showError: boolean = false;
  @Input() showErrorWithoutTouched: boolean = false;

  errorMessage: string | null = null;
  value: string = "";

  ngOnInit() {
    this.required = !!this.ngControl?.control?.hasValidator(Validators.required);
    this.errorMessage = this.getErrorMessage();
    if (this.takeRequiredFromControl) {
      this.ngControl.control?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.required = !!this.ngControl.control?.hasValidator(Validators.required);
        this.errorMessage = this.getErrorMessage();
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}
  onTouch = () => {};

  // CVA
  writeValue(value: string): void {
    this.value = value ?? '';
  }

  onChange = (_: string) => {};
  onTouched = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange() {
    this.onChange(this.value);
    this.onTouch();
  }

  handleInput(value: string) {
    this.value = value;
    this.onChange(value);
  }

  handleBlur() {
    this.onTouched();
  }

  get errors(): Record<string, any> | null {
    return this.ngControl?.control?.errors ?? null;
  }

  getErrorMessage(): string | null {
    const errors = this.errors;
    if (!errors) return null;

    if (errors['required']) return 'This field is required.';
    if (errors['email']) return 'Invalid email address.';
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} characters required.`;
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed.`;
    if (errors['pattern']) return 'Invalid format.';
    if (errors['confirm_password_mismatch']) return 'Passwords do not match.';

    const firstKey = Object.keys(errors)[0];
    return errors[firstKey]?.message ?? 'Invalid value';
  }
}
