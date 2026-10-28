import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MoInputTextComponent } from '../../core/component/lib/mo-input-text/mo-input-text.component';
import { IInputTextFloatLabelRequired } from '../../core/component/lib/mo-input-text/mo-input-text.interface';
import { MoInputNumberComponent } from '../../core/component/lib/mo-input-number/mo-input-number.component';
import { IInputNumberFloatLabelRequired } from '../../core/component/lib/mo-input-number/mo-input-number.interface';
import {
  RadioBtnSelectorComponent,
  SelectorOption,
} from '../../core/component/lib/radio-btn-selector/radio-btn-selector.component';
import { CategoryService } from '../../shared/services/category.service';
import { ConsultationService } from '../../shared/services/consultation.service';
import { ProjectService } from '../../shared/services/project.service';
import { ICategory } from '../../core/interface/category.interface';

/**
 * فرم درخواست مشاوره و برآورد قیمت (صفحه /request)
 * ثبت در endpoint عمومی /api/consultations (multipart — با فایل)
 */
@Component({
  selector: 'app-user-request-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
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
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private consultationService = inject(ConsultationService);
  private projectService = inject(ProjectService);

  /** دسته‌بندی کابینت (برای فیلد cabinetType) */
  categories: ICategory[] = [];

  /** محدودیت آپلود — مطابق تنظیمات multer بک‌اند */
  readonly MAX_FILES = 8;
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  selectedFiles: File[] = [];
  fileError = '';
  submitting = false;

  /** عنوان پروژه‌ی ارجاع‌شده (برای ورود از صفحه‌ی جزئیات) */
  refProjectTitle = '';

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

  /** گزینه‌های بودجه (بازه‌ی قیمت) */
  readonly budgetOptions = [
    { value: 'under-50m', label: 'کمتر از ۵۰ میلیون تومان' },
    { value: '50-100m', label: '۵۰ تا ۱۰۰ میلیون تومان' },
    { value: '100-200m', label: '۱۰۰ تا ۲۰۰ میلیون تومان' },
    { value: 'over-200m', label: 'بیش از ۲۰۰ میلیون تومان' },
    { value: 'unknown', label: 'نامشخص' },
  ];

  ngOnInit(): void {
    this.configInit();
    this.formInit();
    this.loadCategories();
    this.checkRefParam();
  }

  /** بارگذاری دسته‌بندی‌ها برای فیلد نوع کابینت */
  private loadCategories(): void {
    this.categoryService.list().subscribe({
      next: (data) => (this.categories = data || []),
      error: () => (this.categories = []),
    });
  }

  /** اگر از صفحه‌ی جزئیات پروژه آمده (ref) عنوان را در توضیحات درج می‌کند */
  private checkRefParam(): void {
    this.route.queryParamMap.subscribe((params) => {
      const ref = params.get('ref');
      if (!ref) return;
      this.projectService.getById(ref).subscribe({
        next: (project) => {
          this.refProjectTitle = project.title;
          this.requestForm.patchValue({
            description: `درخواست برای پروژه‌ی مشابه: ${project.title}`,
          });
        },
        error: () => {
          /* ارجاع نامعتبر — فرم عادی */
        },
      });
    });
  }

  private formInit() {
    this.requestForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      cabinetType: [null, Validators.required],
      cabinetStyle: [null, Validators.required],
      cabinetColor: [null, Validators.required],
      dimensions: [''],
      city: [''],
      budget: [''],
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

  /* =========================
     مدیریت فایل‌ها
========================= */

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const incoming = Array.from(input.files || []);
    const errors: string[] = [];
    const accepted: File[] = [];

    for (const file of incoming) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        errors.push(`نوع فایل «${file.name}» مجاز نیست (فقط jpg / png / webp).`);
        continue;
      }
      if (file.size > this.MAX_FILE_SIZE) {
        errors.push(`حجم فایل «${file.name}» بیش از ۵ مگابایت است.`);
        continue;
      }
      accepted.push(file);
    }

    const combined = [...this.selectedFiles, ...accepted];
    if (combined.length > this.MAX_FILES) {
      combined.length = this.MAX_FILES;
      errors.push(`حداکثر ${this.MAX_FILES} تصویر قابل بارگذاری است.`);
    }

    this.selectedFiles = combined;
    this.fileError = errors.join(' ');

    // ریست ورودی تا انتخاب دوباره‌ی همان فایل ممکن باشد
    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  /* =========================
     ثبت فرم
========================= */

  submit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const value = this.requestForm.getRawValue();
    const formData = new FormData();

    formData.append('fullName', String(value.fullName || '').trim());
    formData.append('phone', String(value.phoneNumber || '').trim());

    const category = value.cabinetType as ICategory | null;
    if (category) {
      formData.append('cabinetType', category.slug);
      formData.append('serviceType', category.name);
    }

    if (value.cabinetStyle) formData.append('style', value.cabinetStyle);
    if (value.cabinetColor) formData.append('color', value.cabinetColor);
    if (value.dimensions) formData.append('dimensions', String(value.dimensions).trim());
    if (value.city) formData.append('city', String(value.city).trim());
    if (value.budget) formData.append('budget', value.budget);
    if (value.description) formData.append('description', String(value.description).trim());

    this.selectedFiles.forEach((file) => formData.append('files', file));

    this.submitting = true;
    this.consultationService.create(formData).subscribe({
      next: () => {
        this.submitting = false;
        this.requestForm.reset();
        this.selectedFiles = [];
        this.fileError = '';
        this.toastr.success('درخواست شما با موفقیت ثبت شد. کارشناسان ما به‌زودی با شما تماس می‌گیرند.');
      },
      error: () => (this.submitting = false),
    });
  }
}
