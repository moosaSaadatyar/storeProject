import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, inject, Input, OnInit, Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { IFormErrorConfig } from '../form-errors/form-errors.interface';
import { RequierdFiledService } from '../../../service/RequierdFiled/RequierdFiled.service';
import { IInputTextConfig } from './mo-input-text.interface';

@Component(
  {
    selector: 'mo-input-text[config]',
    templateUrl: './mo-input-text.component.html',
    styleUrls: ['./mo-input-text.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      ChipModule,
      FormsModule,
      FormErrorsComponent,
      SkeletonModule,
    ],
  }
)
export class MoInputTextComponent implements ControlValueAccessor, OnInit {
  @Input()
  public config !: IInputTextConfig;

  @Input()
  public readonly?: boolean = false;
  @Input()
  public isDataLoading: boolean = false;
  @Input()
  public errorConfig: IFormErrorConfig;
  @Input() isPending: boolean = false; // از parent میاد

  @Input()
  public disabled?: boolean;

  public model!: object;

  public loadingMode = false;

  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private _ch = inject(ChangeDetectorRef)
  constructor(
    private commonService: RequierdFiledService,
  ) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.createClass();
    this.errorConfigInit();
  }

  public writeValue(obj: any): void {
    if (this.isPending) {
      this.loadingMode = true;
      this.model = null;
      return;
    }

    this.loadingMode = false;
    this.model = obj ?? null;
    this._ch.detectChanges()
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

  public changeHandler(event: any) {
    this.model = event.trim();
    this.onChange(event.trim());
  }
  public onChange: (event) => unknown;

  public onTouched: () => unknown;

  private createClass() {
    this.commonService.labelHandle(this.config);
    this.commonService.addRequiredStar(this.config, this.control);
  }

  private errorConfigInit(): void {
    this.errorConfig = {
      control: this.control,
      errors: this.config?.errors
    }
  }

  get control(): AbstractControl {
    return this.ngControl.control;
  }


}
