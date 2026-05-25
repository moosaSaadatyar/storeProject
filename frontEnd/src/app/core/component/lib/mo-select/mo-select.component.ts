import { AfterViewInit, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectModule } from 'primeng/select';

import { IBhrSelect, IDynamicSelectItem } from './mo-select.interface';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { IFormErrorConfig } from '../form-errors/form-errors.interface';
import { RequierdFiledService } from 'mo-ui/core/service/RequierdFiled/RequierdFiled.service';
import { GLOBAL_WORDS } from 'mo-ui/core/static/constants/persian-context.constant';
import { LoadingComponent } from '../loading/loading.component';
import { Unsubscriber } from 'mo-ui/core/static/helpers/unsubscriber';

const events = [
  'onChange'
]

@Component({
  selector: 'mo-select[selectionConfig]',
  templateUrl: './mo-select.component.html',
  styleUrls: ['./mo-select.component.css'],
  standalone: true,
  imports: [
    FormErrorsComponent,
    LoadingComponent,
    TooltipModule,
    TranslateModule,
    SkeletonModule,
    SelectModule
  ],
})
export class BhrSelectComponent extends Unsubscriber implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  @Input() selectionConfig!: IBhrSelect;

  @Input()
  public readonly: boolean = false

  @ViewChild('selectComp') selectComp: any;

  private originalItems: any[] = [];

  public subscription = new Subscription();

  public loadingMode = false;

  public errorConfig!: IFormErrorConfig;

  public disabled: boolean;

  public readonly GLOBAL_WORDS = GLOBAL_WORDS;

  public isStateLoading = true;
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private commonService = inject(RequierdFiledService)
  private _ch = inject(ChangeDetectorRef)
  constructor() {
    super()
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.classHandle();
    this.loadingMode$Handler();
    this.loadData();
    this.errorConfigInit();
    this.reloadData();
  }

  ngAfterViewInit(): void {
    this.handleEvents();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleEvents(): void {
    this.subscription.add(
      this.commonService.handleEvents(
        events,
        this.selectComp,
        this.selectionConfig
      )
    )
  }

  public reloadData(): void {
    this.isStateLoading = true;
    if (this.selectionConfig?.reloadData$) {
      this.anotherSubscription =
        this.selectionConfig.reloadData$
          .subscribe(
            () => {
              this.loadData();
            }
          );
    }
  }


  private classHandle(): void {
    this.commonService.addRequiredStar(this.selectionConfig, this.control);
  }

  compareFn = (a: any, b: any): boolean => {
    return a[this.selectionConfig.optionValue] === b[this.selectionConfig.optionValue];
  };

  set treeSelectValue(val) {
    if (this.selectionConfig) {
      this.selectionConfig.selectedItems = val;
    }
  }

  get treeSelectValue() {
    return this.selectionConfig.selectedItems;
  }

  get control(): AbstractControl {
    return this.ngControl.control
  }

  writeValue(obj: any): void {
    this.treeSelectValue = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.readonly = isDisabled;
  }

  onChange: Function = () => { };

  onTouched: Function = () => { };

  loadData() {

    if (this.selectionConfig?.options$) {

      this.loadingMode = true;

      this.selectionConfig.items = [];

      this.subscription.add(
        this.selectionConfig?.options$.subscribe({
          next: result => {
            this.handleItemsBasedOnReadonly(result)
            this.handleDefault(result?.items);
            this.originalItems = [...this.selectionConfig.items];
            this._ch.detectChanges();
            this.loadingMode = false;
          },
        })
      );
    }

  }

  private handleItemsBasedOnReadonly(result) {
    if (this.readonly) {
      this.selectionConfig.items = (result?.items as IDynamicSelectItem[]).map((item) => ({ ...item, disabled: this.readonly }));
    } else {
      this.selectionConfig.items = result?.items as IDynamicSelectItem[];
    }
  }

  public handleDefault(list: any[]): void {
    if (this.selectionConfig.useDefault) {

      const defaultValue = list?.find(item => item?.isDefault)?.id;

      if ([null, '', undefined].includes(this.control.value) &&
        defaultValue
      ) {
        this.writeValue(defaultValue);
      }

    }
  }


  private loadingMode$Handler(): void {
    this.anotherSubscription =
      this.selectionConfig?.loadingMode$
        ?.subscribe(
          (value: boolean) => {
            this.loadingMode = value;
            if (value) {
              this.selectionConfig.items = [];
            }
          }
        )
  }

  private errorConfigInit(): void {
    this.errorConfig = {
      control: this.control,
      errors: this.selectionConfig.errors
    }
  }

  filterFunction(event: any): void {
    const query = event?.filter?.toLowerCase();

    if (!query) {
      this.selectionConfig.items = [...this.originalItems];
    } else {
      this.selectionConfig.items = this.originalItems.filter(item => {
        const label = item[this.selectionConfig.optionLabel ?? 'topic']?.toString().toLowerCase();
        return label?.includes(query);
      });
    }

    this._ch.detectChanges();
  }
}
