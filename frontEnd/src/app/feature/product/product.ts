import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MoHeader } from '../../core/component/lib/mo-header/mo-header';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MoInputTextComponent } from '../../core/component/lib/mo-input-text/mo-input-text.component';
import { IInputTextFloatLabelRequired } from '../../core/component/lib/mo-input-text/mo-input-text.interface';
import { MoInputNumberComponent } from '../../core/component/lib/mo-input-number/mo-input-number.component';
import { IInputNumberFloatLabelRequired } from '../../core/component/lib/mo-input-number/mo-input-number.interface';
import { MoButtonComponent } from '../../core/component/lib/mo-button/mo-button.component';
import { CreateProductService } from './create-product.service';
import { NotifyService } from '../../core/service/notif/notif.service';
import { RequierdFiledService } from '../../core/service/RequierdFiled/RequierdFiled.service';
import {
  TranslatePipe,
  TranslateDirective,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    MoHeader,
    ReactiveFormsModule,
    MoInputTextComponent,
    MoInputNumberComponent,
    MoButtonComponent,
    TranslateModule,
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  public form: FormGroup;

  public titleConfig: IInputTextFloatLabelRequired;
  public priceConfig: IInputNumberFloatLabelRequired;
  public discriptionConfig: IInputTextFloatLabelRequired;
  public urlConfig: IInputTextFloatLabelRequired;

  private fb = inject(FormBuilder);
  private productService = inject(CreateProductService);
  private notifyService = inject(NotifyService);
  private requierdFeild = inject(RequierdFiledService);
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    this.formInIt();
    this.formConfigInit();
  }

  formInIt() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      price: [null, Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  formConfigInit() {
    this.titleConfig = {
      floatLabel: this.translateService.instant('TITLE'),
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };

    this.discriptionConfig = {
      floatLabel: this.translateService.instant('DISCRIPTION'),
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };

    this.urlConfig = {
      floatLabel: this.translateService.instant('URL'),
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };
    
    this.priceConfig = {
      floatLabel: this.translateService.instant('PRICE'),
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };
  }

  public submit() {
    if (this.form.invalid) {
      this.requierdFeild.showErrorMessages(this.form);
    } else {
      this.productService.create(this.form.value).subscribe({
        next: (data) => {
          this.notifyService.success(data.message);
        },
      });
    }
  }
}
