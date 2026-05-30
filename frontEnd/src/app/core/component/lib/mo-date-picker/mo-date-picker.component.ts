import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import * as _moment from 'moment';
import { IDatePickerOtherOptions } from './mo-date-picker.interface';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

// Material Imports
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Internal Project Imports
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { IFormErrorConfig } from '../form-errors/form-errors.interface';
import { RequierdFiledService } from '../../../service/RequierdFiled/RequierdFiled.service';
import { MoIconButtonComponent } from '../mo-icon-button/mo-icon-button.component';
import { TooltipModule } from 'primeng/tooltip';

const moment = (_moment as any).default || _moment;
@Component({
  selector: 'mo-date-picker',
  templateUrl: './mo-date-picker.component.html',
  styleUrls: ['./mo-date-picker.component.css'],
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    MoIconButtonComponent,
    FormErrorsComponent,
    TooltipModule,
    TooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class MoDatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() public disabled: boolean = false;

  @ViewChild('picker') dateInput: MatDatepicker<any>;
  public date = null;

  @Input()
  public customFloatLabel?: string;

  @Input()
  public readonly?: boolean;

  @Input()
  public placeholder = '';

  @Input()
  public minDate = '';

  @Input()
  public maxDate = '';

  @Input()
  public otherOptions: IDatePickerOtherOptions = {};

  @Input() withTime: boolean = true;

  @Output() public _onSelect = new EventEmitter<string>();

  @Output() public _onClear = new EventEmitter<any>();

  private readonly DATE_ONLY_FORMAT = 'YYYY-MM-DD';

  private readonly DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

  /**
   * Filter date between min and max date
   * @param date
   * @returns date
   */
  public myFilter = (date: Date | null) => {
    const dateString = date ? this.getDateString(date) : '';
    return (
      dateString >= (this.minDate ? this.minDate : '1000-01-01T00:00:00') &&
      dateString <= (this.maxDate ? this.maxDate : '3000-01-01T00:00:00')
    );
  };

  public errorConfig: IFormErrorConfig;
  private RequierdFiledService = inject(RequierdFiledService);
  private _ch = inject(ChangeDetectorRef);
  private ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this.classHandle();
    this.errorConfigInit();
  }

  public onChange: Function = () => {
    this._onSelect.emit(this.dateValue);
  };

  public onTouched: Function = () => {};

  public clear() {
    this.dateValue = null;
    this.dateInput.select(null);
    this._onClear.emit(this.dateValue);
  }

  public writeValue(obj: any): void {
    if (!obj) {
      this.date = null;
      return;
    }

    this.date = this.withTime
      ? moment(obj, this.DATE_TIME_FORMAT).toDate()
      : moment(obj, this.DATE_ONLY_FORMAT).toDate();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewChecked(): void {
    this._ch.detectChanges();
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private classHandle() {
    this.RequierdFiledService.addRequiredStar(this.otherOptions, this.control);
  }

  /**
   * Convert date to UTC date format
   * @param date
   * @returns utc full date
   */
  private getDateString(date) {
    const format = this.withTime
      ? this.DATE_TIME_FORMAT
      : this.DATE_ONLY_FORMAT;

    return moment(date).locale('en').format(format);
  }

  private errorConfigInit(): void {
    this.errorConfig = {
      control: this.control,
      errors: this.otherOptions.errors,
    };
  }

  get control(): AbstractControl {
    return this.ngControl.control;
  }

  set dateValue(val) {
    this.date = val;

    const value = val ? this.getDateString(val) : null;

    this.onChange(value);
    this._onSelect.emit(value);
  }

  get dateValue() {
    return this.date;
  }
}
