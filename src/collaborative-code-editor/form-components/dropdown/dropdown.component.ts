import {
  Component,
  DestroyRef,
  HostListener,
  Input,
  OnChanges,
  Optional,
  Self,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NgControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormComponentWrapper } from '../form-component-wrapper/form-component-wrapper';

export interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [FormComponentWrapper, ɵInternalFormsSharedModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent implements ControlValueAccessor, OnChanges {
  constructor(@Optional() @Self() public ngControl: NgControl, private destroyRef: DestroyRef) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: DropdownOption[] = [];
  @Input() allowCustomValue: boolean = true;

  @Input() disabled: boolean = false;
  @Input() takeRequiredFromControl: boolean = true;
  @Input() required: boolean = false;
  @Input() showError: boolean = false;
  @Input() showErrorWithoutTouched: boolean = false;

  value: string | null = null;
  searchTerm: string = '';
  isOpen: boolean = false;
  errorMessage: string | null = null;
  private optionSelected: boolean = false;

  ngOnInit() {
    this.required = !!this.ngControl?.control?.hasValidator(Validators.required);
    this.errorMessage = this.getErrorMessage();

    if (this.takeRequiredFromControl) {
      this.ngControl?.control?.statusChanges
        ?.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.required = !!this.ngControl?.control?.hasValidator(Validators.required);
          this.errorMessage = this.getErrorMessage();
        });
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {}

  // CVA
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value;
    this.searchTerm = this.getLabelForValue(value) ?? value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleSearchInput(term: string) {
    this.searchTerm = term;
    this.optionSelected = false; // Reset flag when user types
    this.isOpen = true;
    if (this.allowCustomValue) {
      this.value = term || null;
      this.onChange(this.value);
    }
  }

  selectOption(option: DropdownOption) {
    this.value = option.value;
    this.searchTerm = option.label;
    this.optionSelected = true;
    this.onChange(option.value);
    this.onTouched();
    this.isOpen = false;
  }

  handleBlur() {
    this.onTouched();
    // Small timeout so click on option still registers before close
    setTimeout(() => {
      this.isOpen = false;
      
      // If an option was just selected, don't overwrite the value
      if (this.optionSelected) {
        this.optionSelected = false;
        return;
      }
      
      if (this.allowCustomValue) {
        // Check if searchTerm matches an option's label - if so, use that option's value
        const matchingOption = this.options.find(
          (opt) => opt.label.toLowerCase() === this.searchTerm.trim().toLowerCase()
        );
        
        if (matchingOption) {
          // If it matches an option, use the option's value
          this.value = matchingOption.value;
          this.searchTerm = matchingOption.label;
        } else {
          // Otherwise, use the searchTerm as custom value
          this.value = this.searchTerm.trim() || null;
        }
        this.onChange(this.value);
      }
    }, 100);
  }

  handleFocus() {
    if (!this.disabled) {
      this.isOpen = true;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.isOpen = false;
  }

  get filteredOptions(): DropdownOption[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.options;
    return this.options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.value.toLowerCase().includes(term)
    );
  }

  private getLabelForValue(value: string | null): string | null {
    if (value == null) return null;
    return this.options.find((opt) => opt.value === value)?.label ?? null;
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

    const firstKey = Object.keys(errors)[0];
    return errors[firstKey]?.message ?? 'Invalid value';
  }
}

