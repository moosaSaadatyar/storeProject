import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IFormErrorConfig } from './form-errors.interface';


const errors: Record<string, string> = {
  'required': 'پرکردن این فیلد الزامی می‌باشد.',
  'website': 'آدرس وبسایت معتبر نمی‌باشد.',
  'validPhoneNumber': 'شماره تلفن همراه معتبر نمی‌باشد. ',
  'validNationalCode': 'شماره ملی وارد شده معتبر نمی‌باشد.',
  'validEmail': 'آدرس ایمیل معتبر نمی باشد',
  'bankCard': 'شماره کارت وارد‌شده معتبر نمی‌باشد.',
  'shaba': 'شماره شبا وارد‌شده معتبر نمی‌باشد.',
  'validTelephone': 'شماره تلفن معتبر نیست',
  'validPercent': ' باید عدد انتخاب شده بین 0 تا 100 باشد',
  'capacity': 'مقدار بیشتر از ظرفیت مجاز وارد شده است'
}

@Component(
  {
    selector: 'app-form-errors[config]',
    templateUrl: './form-errors.component.html',
    styleUrls: ['./form-errors.component.css'],
    standalone: true,
    imports: [
      CommonModule
    ],
  }
)
export class FormErrorsComponent implements OnChanges {

  @Input()
  public config!: IFormErrorConfig;


  ngOnChanges(changes: SimpleChanges): void {
    if (this.config) {
      this.config.errors = { ...errors, ...(this.config?.errors ?? {}) };
    }
  }

  identifyError(index, error) {
    return error.value
  }

}
