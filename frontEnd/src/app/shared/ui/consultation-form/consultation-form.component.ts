import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CategoryService } from '../../services/category.service';
import { ConsultationService } from '../../services/consultation.service';
import { ICategory } from '../../../core/interface/category.interface';

/**
 * فرم فشرده‌ی مشاوره در صفحه خانه
 * ثبت در endpoint عمومی /api/consultations
 */
@Component({
  selector: 'app-consultation-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.css',
})
export class ConsultationFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly categoryService = inject(CategoryService);
  private readonly consultationService = inject(ConsultationService);

  categories: ICategory[] = [];
  submitting = false;

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    cabinetType: [null as ICategory | null, [Validators.required]],
    description: [''],
  });

  constructor() {
    this.categoryService.list().subscribe({
      next: (data) => (this.categories = data || []),
      error: () => (this.categories = []),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const formData = new FormData();
    formData.append('fullName', value.fullName.trim());
    formData.append('phone', value.phone.trim());
    if (value.cabinetType) {
      formData.append('cabinetType', value.cabinetType.slug);
      formData.append('serviceType', value.cabinetType.name);
    }
    if (value.description.trim()) {
      formData.append('description', value.description.trim());
    }

    this.submitting = true;
    this.consultationService.create(formData).subscribe({
      next: (res) => {
        this.submitting = false;
        this.form.reset();
        this.toastr.success('درخواست شما با موفقیت ثبت شد.');
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
