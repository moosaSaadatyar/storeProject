import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { IFormErrorConfig } from '../form-errors/form-errors.interface';
import { IInputMaskConfig } from './mo-input-mask.interface';
import { TranslateModule } from '@ngx-translate/core';
import { RequierdFiledService } from '../../../service/RequierdFiled/RequierdFiled.service';

@Component(
  {
    selector: 'mo-input-mask',
    templateUrl: './mo-input-mask.component.html',
    styleUrls: ['./mo-input-mask.component.css'],
    standalone: true,
    imports:
      [
        CommonModule,
        FormsModule,
        FormErrorsComponent,
        InputMaskModule,
        TranslateModule
      ]
  }
)
export class MoInputMaskComponent implements ControlValueAccessor, OnInit {
  @Input()
  public config !: IInputMaskConfig;

  @Input()
  public readonly?: boolean = false;

  @Input()
  public errorConfig: IFormErrorConfig;

  @Input()
  public disabled?: boolean;

  public model;
  private _Ch = inject(ChangeDetectorRef);
  private commonService = inject(RequierdFiledService)
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  constructor(
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this.createClass();
    this.errorConfigInit();
  }

  public writeValue(obj: any): void {
    this.model = obj;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public changeHandler(event: string): void {
    let filterString = event?.replace(/[\-_]/g, '');

    this.model = event;

    this.onChange(filterString ?? null);
    this._Ch.detectChanges()
  }

  public onChange: (event) => unknown;

  public onTouched: () => unknown;

  private createClass() {
    this.commonService.labelHandle(this.config);
    this.commonService.addRequiredStar(this.config, this.control);
  }

  private errorConfigInit(): void {
    this.errorConfig =
    {
      control: this.control,
      errors: this.config?.errors
    };
  }

  get control(): AbstractControl {
    return this.ngControl.control;
  }

}
