import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MoButtonComponent } from '../../core/component/lib/mo-button/mo-button.component';
import { MoHeader } from '../../core/component/lib/mo-header/mo-header';
import { MoInputNumberComponent } from '../../core/component/lib/mo-input-number/mo-input-number.component';
import { IInputNumberFloatLabelRequired } from '../../core/component/lib/mo-input-number/mo-input-number.interface';
import { MoInputTextComponent } from '../../core/component/lib/mo-input-text/mo-input-text.component';
import { IInputTextFloatLabelRequired } from '../../core/component/lib/mo-input-text/mo-input-text.interface';
import { IMoSelect } from '../../core/component/lib/mo-select/mo-select.interface';
import { MoSelectComponent } from '../../core/component/lib/mo-select/mo-select.component';
import { RequierdFiledService } from '../../core/service/RequierdFiled/RequierdFiled.service';
import { NotifyService } from '../../core/service/notif/notif.service';
import { CreateProductService } from './create-product.service';
import { MoTableComponent } from '../../shared/dynamics/mo-table/mo-table.component';
import { MoTableActionsConfig, MoTableConfig } from '../../shared/dynamics/mo-table/mo-table-interFace';

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
    MoTableComponent,
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  public form: FormGroup;
  public tableConfig: MoTableConfig;
  public tableReloadData: { createdAt: number; productId?: string } | null = null;

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
    this.tableInit();
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
      inputId: 'description',
      containerClass: 'p-float-label',
    };

    this.urlConfig = {
      floatLabel: 'URL',
      maxLength: 254,
      inputId: 'imageUrl',
      containerClass: 'p-float-label',
    };

    this.priceConfig = {
      floatLabel: 'PRICE',
      maxLength: 254,
      inputId: 'price',
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
        next: (data: any) => {
          this.notifyService.success(data.message);
          this.tableReloadData = { createdAt: Date.now(), productId: data.productId };
          this.form.reset({ discount: 0, inStock: true });
        },
      });
    }
  }

  public onTableAction(event) {
  }

  private tableInit() {
    this.tableConfig = {
      api: {
        url: 'get-productes',
        dataPath: 'products',
      },
      dataKey: '_id',
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [10, 25, 50],
      showGridlines: true,
      stripedRows: true,
      tableStyle: { 'min-width': '74rem' },
      emptyMessage: 'NO_CONTENT',
      loadingMessage: 'BHR_TABLE_LOADING',
      errorMessage: 'BHR_TABLE_LOAD_ERROR',
      actions: {
        show: true,
        header: 'ACTIONS',
        view: true,
        edit: true,
        delete: true,
      },
      columns: [
        { field: 'title', header: 'TITLE', sortable: true, width: '14rem' },
        { field: 'description', header: 'DISCRIPTION', width: '34rem' },
        {
          field: 'price',
          header: 'PRICE',
          sortable: true,
          align: 'center',
          suffix: 'TOMAN',
          formatter: (value) => this.formatNumber(value),
        },
        {
          field: 'oldPrice',
          header: 'OLD_PRICE',
          align: 'center',
          suffix: 'TOMAN',
          formatter: (value) => this.formatNumber(value),
        },
        {
          field: 'discount',
          header: 'DISCOUNT',
          sortable: true,
          align: 'center',
          formatter: (value) => `${value ?? 0}%`,
        },
        {
          field: 'inStock',
          header: 'IN_STOCK',
          align: 'center',
          translateValue: true,
          formatter: (value) => value ? 'VALID' : 'INVALID',
        },
        { field: 'imageUrl', header: 'IMAGE', width: '10rem' },
      ],
    };
  }

  private formatNumber(value: unknown): string {
    const numberValue = Number(value ?? 0);
    return numberValue.toLocaleString('fa-IR');
  }
}
