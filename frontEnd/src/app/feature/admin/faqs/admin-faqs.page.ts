import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FaqService } from '../../../shared/services/faq.service';
import { IFaq } from '../../../core/interface/faq.interface';

/**
 * مدیریت سوالات متداول — لیست + فرم افزودن/ویرایش
 */
@Component({
  selector: 'app-admin-faqs-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    SkeletonModule,
    ToggleSwitchModule,
    TagModule,
    TextareaModule,
    ConfirmDialogModule,
  ],
  templateUrl: './admin-faqs.page.html',
  styleUrl: './admin-faqs.page.css',
})
export class AdminFaqsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly faqService = inject(FaqService);
  private readonly confirmDialog = inject(ConfirmationService);

  faqs: IFaq[] = [];
  loading = true;
  saving = false;

  /** سوال در حال ویرایش (null = حالت افزودن) */
  editing: IFaq | null = null;

  readonly form = this.fb.nonNullable.group({
    question: ['', [Validators.required, Validators.minLength(3)]],
    answer: ['', [Validators.required, Validators.minLength(3)]],
    sortOrder: [0],
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.loading = true;
    this.faqService.adminList({ limit: 100 }).subscribe({
      next: (data) => {
        this.faqs = data?.items || [];
        this.loading = false;
      },
      error: () => {
        this.faqs = [];
        this.loading = false;
      },
    });
  }

  startEdit(faq: IFaq): void {
    this.editing = faq;
    this.form.patchValue({
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder ?? 0,
      isActive: faq.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.editing = null;
    this.form.reset({
      question: '',
      answer: '',
      sortOrder: 0,
      isActive: true,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const body = {
      question: value.question.trim(),
      answer: value.answer.trim(),
      sortOrder: value.sortOrder,
      isActive: value.isActive,
    };

    this.saving = true;
    const request$ = this.editing
      ? this.faqService.adminUpdate(this.editing._id, body)
      : this.faqService.adminCreate(body);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(this.editing ? 'سوال به‌روزرسانی شد.' : 'سوال ایجاد شد.');
        this.resetForm();
        this.loadFaqs();
      },
      error: (err) => {
        this.saving = false;
        const message = err?.error?.message;
        this.toastr.error(message || 'ذخیره‌ی سوال ممکن نشد.');
      },
    });
  }

  confirmDelete(faq: IFaq): void {
    this.confirmDialog.confirm({
      message: `سوال «${faq.question}» حذف شود؟`,
      header: 'حذف سوال',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'انصراف',
      accept: () => {
        this.faqService.adminDelete(faq._id).subscribe({
          next: () => {
            this.toastr.success('سوال حذف شد.');
            if (this.editing?._id === faq._id) this.resetForm();
            this.loadFaqs();
          },
          error: () => this.toastr.error('حذف سوال ممکن نشد.'),
        });
      },
    });
  }
}
