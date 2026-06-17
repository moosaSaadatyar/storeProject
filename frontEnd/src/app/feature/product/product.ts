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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IMoSelect } from '../../core/component/lib/mo-select/mo-select.interface';
import { MoSelectComponent } from '../../core/component/lib/mo-select/mo-select.component';
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
    MoSelectComponent,
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
  public oldPriceConfig: IInputNumberFloatLabelRequired;
  public discountConfig: IInputNumberFloatLabelRequired;
  public inStockConfig: IMoSelect;

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
      title: ['', [Validators.required, Validators.minLength(3)]],

      description: ['', [Validators.required, Validators.minLength(10)]],

      imageUrl: ['', [Validators.required]],

      price: [null, [Validators.required, Validators.min(0)]],

      oldPrice: [null],

      discount: [0, [Validators.min(0), Validators.max(100)]],

      inStock: [true, [Validators.required]],

    });
  }

  formConfigInit() {
    this.titleConfig = {
      floatLabel: 'TITLE',
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };

    this.discriptionConfig = {
      floatLabel: 'DISCRIPTION',
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };

    this.urlConfig = {
      floatLabel: 'URL',
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };

    this.priceConfig = {
      floatLabel: 'PRICE',
      maxLength: 254,
      inputId: 'title',
      containerClass: 'p-float-label',
    };

    this.oldPriceConfig = {
      floatLabel: 'OLD_PRICE',
      maxLength: 254,
      inputId: 'oldPrice',
      containerClass: 'p-float-label',
    };

    this.discountConfig = {
      floatLabel: 'DISCOUNT',
      maxLength: 254,
      inputId: 'discount',
      containerClass: 'p-float-label',
    };

    this.inStockConfig = {
      floatLabel: 'IN_STOCK',
      selectId: 'inStock',

      optionLabel: 'topic',
      optionValue: 'bValue',
      items: [
        { topic: this.translateService.instant('VALID'), bValue: true },
        { topic: this.translateService.instant('INVALID'), bValue: false },
      ],

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
