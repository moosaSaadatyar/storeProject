import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mo-check-box',
  templateUrl: './mo-check-box.component.html',
  styleUrls: ['./mo-check-box.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoCheckBoxComponent),
      multi: true,
    },
  ],
})
export class MoCheckBoxComponent {

  @Input() id!: string;

  @Input() title!: string;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Output() _onChange?: EventEmitter<boolean> = new EventEmitter(null);

  value = false;

  set checkBoxValue(val) {
    this.value = val;
  }

  get checkBoxValue() {
    return this.value;
  }

  writeValue(obj: any): void {
    this.checkBoxValue = obj;
    this.onChange(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void { }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange: Function = event => { this._onChange.emit(this.checkBoxValue) };
}
