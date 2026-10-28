import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TestimonialService } from '../../../shared/services/testimonial.service';
import { ITestimonial } from '../../../core/interface/testimonial.interface';

/**
 * مدیریت نظرات مشتریان — تأیید/رد + ویرایش + حذف
 */
@Component({
  selector: 'app-admin-testimonials-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RatingModule,
    SkeletonModule,
    ToggleSwitchModule,
    TagModule,
    TextareaModule,
    ConfirmDialogModule,
  ],
  templateUrl: './admin-testimonials.page.html',
  styleUrl: './admin-testimonials.page.css',
})
export class AdminTestimonialsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly testimonialService = inject(TestimonialService);
  private readonly confirmDialog = inject(ConfirmationService);

  testimonials: ITestimonial[] = [];
  loading = true;
  saving = false;

  /** نمایش فقط موارد در انتظار بررسی */
  showPendingOnly = false;

  /** نظره در حال ویرایش (null = حالت افزودن) */
  editing: ITestimonial | null = null;

  /** شناسه‌ی ردیف باز */
  expandedId: string | null = null;

  readonly form = this.fb.nonNullable.group({
    customerName: [''],
    comment: ['', [Validators.required, Validators.minLength(5)]],
    rating: [5],
    projectType: [''],
    isApproved: [true],
  });

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    this.loading = true;
    this.testimonialService
      .adminList({ isApproved: this.showPendingOnly ? false : undefined, limit: 100 })
      .subscribe({
        next: (data) => {
          this.testimonials = data?.items || [];
          this.loading = false;
        },
        error: () => {
          this.testimonials = [];
          this.loading = false;
        },
      });
  }

  onFilterToggle(): void {
    this.loadList();
  }

  startEdit(testimonial: ITestimonial): void {
    this.editing = testimonial;
    this.expandedId = null;
    this.form.patchValue({
      customerName: testimonial.customerName || '',
      comment: testimonial.comment,
      rating: testimonial.rating ?? 5,
      projectType: testimonial.projectType || '',
      isApproved: testimonial.isApproved,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.editing = null;
    this.form.reset({
      customerName: '',
      comment: '',
      rating: 5,
      projectType: '',
      isApproved: true,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const body = {
      customerName: value.customerName.trim() || undefined,
      comment: value.comment.trim(),
      rating: value.rating,
      projectType: value.projectType.trim() || undefined,
      isApproved: value.isApproved,
    };

    this.saving = true;
    const request$ = this.editing
      ? this.testimonialService.adminUpdate(this.editing._id, body)
      : this.testimonialService.adminCreate(body);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(
          this.editing ? 'نظر به‌روزرسانی شد.' : 'نظر ایجاد شد.'
        );
        this.resetForm();
        this.loadList();
      },
      error: (err) => {
        this.saving = false;
        const message = err?.error?.message;
        this.toastr.error(message || 'ذخیره‌ی نظر ممکن نشد.');
      },
    });
  }

  /** تأیید / رد سریع */
  toggleApprove(testimonial: ITestimonial): void {
    const next = !testimonial.isApproved;
    this.testimonialService.adminApprove(testimonial._id, next).subscribe({
      next: (updated) => {
        this.toastr.success(next ? 'نظر تأیید شد.' : 'نظر رد شد.');
        const index = this.testimonials.findIndex((t) => t._id === updated._id);
        if (index !== -1) this.testimonials[index] = updated;
      },
      error: () => this.toastr.error('تغییر وضعیت نظر ممکن نشد.'),
    });
  }

  confirmDelete(testimonial: ITestimonial): void {
    this.confirmDialog.confirm({
      message: 'این نظر مشتری حذف شود؟',
      header: 'حذف نظر',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'انصراف',
      accept: () => {
        this.testimonialService.adminDelete(testimonial._id).subscribe({
          next: () => {
            this.toastr.success('نظر حذف شد.');
            if (this.editing?._id === testimonial._id) this.resetForm();
            this.loadList();
          },
          error: () => this.toastr.error('حذف نظر ممکن نشد.'),
        });
      },
    });
  }

  formatDate(value?: string): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
}
