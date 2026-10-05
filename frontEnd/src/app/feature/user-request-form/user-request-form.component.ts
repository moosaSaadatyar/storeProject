import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MoInputTextComponent } from '../../core/component/lib/mo-input-text/mo-input-text.component';
import { IInputTextConfig } from '../../core/component/lib/mo-input-text copy/mo-input-text.interface';
import { IInputTextFloatLabelRequired } from '../../core/component/lib/mo-input-text/mo-input-text.interface';
import { MoInputNumberComponent } from '../../core/component/lib/mo-input-number/mo-input-number.component';
import { IInputNumberFloatLabelRequired } from '../../core/component/lib/mo-input-number/mo-input-number.interface';
import {
  RadioBtnSelectorComponent,
  SelectorOption,
} from '../../core/component/lib/radio-btn-selector/radio-btn-selector.component';

@Component({
  selector: 'app-user-request-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MoInputTextComponent,
    MoInputNumberComponent,
    RadioBtnSelectorComponent,
  ],
  templateUrl: './user-request-form.component.html',
  styleUrl: './user-request-form.component.css',
})
export class UserRequestFormComponent implements OnInit {
  public fullNameConfig!: IInputTextFloatLabelRequired;
  public numberPhoneConfig!: IInputNumberFloatLabelRequired;
  public requestForm!: FormGroup;
  private fb = inject(FormBuilder);

  cabinetStyle: SelectorOption[] = [
    {
      value: 'classic',
      label: 'کلاسیک',
      icon: 'fa-solid fa-couch',
    },
    {
      value: 'neoclassic',
      label: 'نئوکلاسیک',
      icon: 'fa-solid fa-chair',
    },
    {
      value: 'modern',
      label: 'مدرن',
      icon: 'fa-solid fa-house',
    },
  ];

  cabinetCalor: SelectorOption[] = [
  {
    value: 'white',
    label: 'سفید',
    icon: 'fa-solid fa-circle text-white',
  },
  {
    value: 'wood',
    label: 'طرح چوب',
    icon: 'fa-solid fa-circle',
  },
  {
    value: 'gray',
    label: 'طوسی',
    icon: 'fa-solid fa-circle',
  },
];

  ngOnInit(): void {
    this.configInit();
    this.formInit();
  }

  private formInit() {
    this.requestForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      cabinetStyle: [null, Validators.required],
      cabinetColor: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  private configInit() {
    this.fullNameConfig = {
      floatLabel: 'FULL_NAME',
      inputId: 'fullName',
      maxLength: 24,
    };

    this.numberPhoneConfig = {
      floatLabel: 'PHONE_NUMBER',
      inputId: 'PHONE_NUMBER',
      maxLength: 11,
    };
  }
}
