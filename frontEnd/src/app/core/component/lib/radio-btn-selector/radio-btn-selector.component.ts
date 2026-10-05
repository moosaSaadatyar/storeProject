import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-btn-selector',
  imports: [CommonModule],
  templateUrl: './radio-btn-selector.component.html',
  styleUrl: './radio-btn-selector.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioBtnSelectorComponent),
      multi: true
    }
  ]
})
export class RadioBtnSelectorComponent implements ControlValueAccessor {

  @Input() options: SelectorOption[] = [];

  @Input() name = 'card-selector';

  @Input() disabled = false;

  value: string | null = null;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  selectOption(option: SelectorOption): void {

    if (this.disabled) {
      return;
    }

    this.value = option.value;

    this.onChange(this.value);
    this.onTouched();
  }

  isSelected(option: SelectorOption): boolean {
    return this.value === option.value;
  }
}

export interface SelectorOption {
  value: string;
  label: string;
  icon: string;
}