import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContactService } from '../../../shared/services/contact.service';
import { IContactMessage } from '../../../core/interface/contact.interface';

/**
 * مدیریت پیام‌های تماس — لیست + وضعیت + حذف
 */
@Component({
  selector: 'app-admin-contact-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    PaginatorModule,
    SelectModule,
    SkeletonModule,
    TagModule,
    ConfirmDialogModule,
  ],
  templateUrl: './admin-contact.page.html',
  styleUrl: './admin-contact.page.css',
})
export class AdminContactPage implements OnInit, OnDestroy {
  private readonly contactService = inject(ContactService);
  private readonly toastr = inject(ToastrService);
  private readonly confirmDialog = inject(ConfirmationService);

  messages: IContactMessage[] = [];
  total = 0;
  loading = true;

  page = 1;
  readonly limit = 10;

  /** فیلتر وضعیت */
  statusFilter: string | null = null;

  readonly statusOptions = [
    { value: 'new', label: 'جدید' },
    { value: 'answered', label: 'پاسخ‌داده‌شده' },
  ];

  /** شناسه‌ی پیام باز (جزئیات) */
  expandedId: string | null = null;

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
    this.listSub = this.contactService
      .adminList({
        status: this.statusFilter || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (data) => {
          this.messages = data?.items || [];
          this.total = data?.total || 0;
          this.loading = false;
        },
        error: () => {
          this.messages = [];
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

  toggleExpand(message: IContactMessage): void {
    this.expandedId = this.expandedId === message._id ? null : message._id;
  }

  /** تغییر وضعیت (پاسخ‌داده‌شده / جدید) */
  toggleStatus(message: IContactMessage): void {
    const nextStatus = message.status === 'new' ? 'answered' : 'new';
    this.contactService.adminUpdateStatus(message._id, nextStatus).subscribe({
      next: (updated) => {
        this.toastr.success(
          nextStatus === 'answered' ? 'پیام علامت‌گذاری شد: پاسخ‌داده‌شده.' : 'پیام علامت‌گذاری شد: جدید.'
        );
        const index = this.messages.findIndex((m) => m._id === updated._id);
        if (index !== -1) this.messages[index] = updated;
      },
      error: () => this.toastr.error('تغییر وضعیت ممکن نشد.'),
    });
  }

  confirmDelete(message: IContactMessage): void {
    this.confirmDialog.confirm({
      message: `پیام «${message.fullName}» حذف شود؟`,
      header: 'حذف پیام',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'انصراف',
      accept: () => {
        this.contactService.adminDelete(message._id).subscribe({
          next: () => {
            this.toastr.success('پیام حذف شد.');
            this.loadList();
          },
          error: () => this.toastr.error('حذف پیام ممکن نشد.'),
        });
      },
    });
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
