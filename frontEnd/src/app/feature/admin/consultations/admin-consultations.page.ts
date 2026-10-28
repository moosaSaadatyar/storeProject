import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConsultationService } from '../../../shared/services/consultation.service';
import { IConsultation } from '../../../core/interface/consultation.interface';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * مدیریت درخواست‌های مشاوره — لیست + تغییر وضعیت + جزئیات
 */
@Component({
  selector: 'app-admin-consultations-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    SelectModule,
    SkeletonModule,
    TagModule,
    ConfirmDialogModule,
  ],
  templateUrl: './admin-consultations.page.html',
  styleUrl: './admin-consultations.page.css',
})
export class AdminConsultationsPage implements OnInit, OnDestroy {
  private readonly consultationService = inject(ConsultationService);
  private readonly toastr = inject(ToastrService);
  private readonly confirmDialog = inject(ConfirmationService);

  resolveUrl = resolveImageUrl;

  consultations: IConsultation[] = [];
  total = 0;
  loading = true;

  page = 1;
  readonly limit = 10;

  /** فیلتر وضعیت (null = همه) */
  statusFilter: string | null = null;

  /** شناسه‌ی ردیف باز (جزئیات) */
  expandedId: string | null = null;

  /** وضعیت انتخاب‌شده برای ردیف باز */
  statusDraft: string | null = null;

  /** یادداشت مدیر برای ردیف باز */
  adminNoteDraft = '';

  /* گزینه‌های وضعیت */
  readonly statusOptions = [
    { value: 'new', label: 'جدید' },
    { value: 'in-progress', label: 'در حال پیگیری' },
    { value: 'completed', label: 'تکمیل‌شده' },
    { value: 'cancelled', label: 'لغو‌شده' },
  ];

  private listSub?: Subscription;

  ngOnInit(): void {
    this.loadList();
  }

  ngOnDestroy(): void {
    this.listSub?.unsubscribe();
  }

  loadList(): void {
    this.loading = true;
    this.listSub?.unsubscribe();
    this.listSub = this.consultationService
      .adminList({
        status: this.statusFilter || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (data) => {
          this.consultations = data?.items || [];
          this.total = data?.total || 0;
          this.loading = false;
        },
        error: () => {
          this.consultations = [];
          this.total = 0;
          this.loading = false;
        },
      });
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadList();
  }

  onPageChange(event: { page: number }): void {
    this.page = event.page + 1;
    this.loadList();
  }

  /** باز/بسته‌کردن جزئیات */
  toggleExpand(item: IConsultation): void {
    if (this.expandedId === item._id) {
      this.expandedId = null;
    } else {
      this.expandedId = item._id;
      this.statusDraft = item.status;
      this.adminNoteDraft = item.adminNote || '';
    }
  }

  /** ذخیره‌ی وضعیت + یادداشت */
  saveStatus(item: IConsultation, status: string): void {
    this.consultationService
      .adminUpdateStatus(item._id, { status, adminNote: this.adminNoteDraft })
      .subscribe({
        next: (updated) => {
          this.toastr.success('وضعیت به‌روزرسانی شد.');
          const index = this.consultations.findIndex(
            (c) => c._id === updated._id
          );
          if (index !== -1) this.consultations[index] = updated;
          this.adminNoteDraft = updated.adminNote || '';
        },
        error: () => this.toastr.error('به‌روزرسانی وضعیت ممکن نشد.'),
      });
  }

  /** حذف با تأیید */
  confirmDelete(item: IConsultation): void {
    this.confirmDialog.confirm({
      message: `درخواست مشاوره‌ی «${item.fullName}» حذف شود؟`,
      header: 'حذف درخواست',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'انصراف',
      accept: () => {
        this.consultationService.adminDelete(item._id).subscribe({
          next: () => {
            this.toastr.success('درخواست حذف شد.');
            this.loadList();
          },
          error: () => this.toastr.error('حذف درخواست ممکن نشد.'),
        });
      },
    });
  }

  statusLabel(status: string): string {
    return this.statusOptions.find((o) => o.value === status)?.label || status;
  }

  statusSeverity(status: string): string {
    switch (status) {
      case 'new':
        return 'success';
      case 'in-progress':
        return 'warn';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  formatDate(value?: string): string {
    if (!value) return '';
    return new Date(value).toLocaleString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
