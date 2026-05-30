import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';


import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { ChipModule } from 'primeng/chip';
import { IFormErrorConfig } from '../form-errors/form-errors.interface';
import { IInputNumberConfig } from './mo-input-number.interface';
import { CostFormatterDirective } from '../../../directives/cost(Rile)/costNumberFormater';
import { MaxNumberDirective } from '../../../directives/cost(Rile)/maxNumber';
import { OnlyNumber } from '../../../directives/only-number/only-number.directive';
import { RequierdFiledService } from '../../../service/RequierdFiled/RequierdFiled.service';


@Component(
  {
    selector: 'mo-input-number[config]',
    templateUrl: './mo-input-number.component.html',
    styleUrls: ['./mo-input-number.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ChipModule,
      OnlyNumber,
      FormErrorsComponent,
      CostFormatterDirective,
      MaxNumberDirective
    ],
  }
)
export class MoInputNumberComponent implements OnInit, ControlValueAccessor {

  @Input()
  public config !: IInputNumberConfig;

  @Input()
  public readonly?: boolean = false;

  @Input()
  public errorConfig?: IFormErrorConfig;

  @Input()
  public disabled?: boolean;

  public model!: object;
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private commonService = inject(RequierdFiledService)

  constructor(
  ) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.classHandle();
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
  public changeHandler(event: any) {
    this.model = event;
    this.onChange(event);
  }
  public onChange: (event) => unknown;

  public onTouched: () => unknown;

  private classHandle(): void {
    this.commonService.addRequiredStar(this.config, this.control);
    this.commonService.labelHandle(this.config);
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
