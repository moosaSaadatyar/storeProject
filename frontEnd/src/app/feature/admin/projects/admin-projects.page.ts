import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProjectService } from '../../../shared/services/project.service';
import { IProject } from '../../../core/interface/project.interface';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * مدیریت پروژه‌ها — لیست با جست‌وجو + صفحه‌بندی + عملیات
 */
@Component({
  selector: 'app-admin-projects-page',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    SkeletonModule,
    TagModule,
    ConfirmDialogModule,
  ],
  templateUrl: './admin-projects.page.html',
  styleUrl: './admin-projects.page.css',
})
export class AdminProjectsPage implements OnInit, OnDestroy {
  private readonly projectService = inject(ProjectService);
  private readonly toastr = inject(ToastrService);
  private readonly confirmDialog = inject(ConfirmationService);

  projects: IProject[] = [];
  total = 0;
  loading = true;

  page = 1;
  readonly limit = 10;

  /** جست‌وجو */
  q = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  private listSub?: Subscription;

  resolveUrl = resolveImageUrl;

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.listSub?.unsubscribe();
  }

  loadProjects(): void {
    this.loading = true;
    this.listSub?.unsubscribe();
    this.listSub = this.projectService
      .adminList({
        q: this.q || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (data) => {
          this.projects = data?.items || [];
          this.total = data?.total || 0;
          this.loading = false;
        },
        error: () => {
          this.projects = [];
          this.total = 0;
          this.loading = false;
        },
      });
  }

  /** جست‌وجو با تأخیر (debounce) */
  onSearchChange(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page = 1;
      this.loadProjects();
    }, 400);
  }

  onPageChange(event: { page: number }): void {
    this.page = event.page + 1;
    this.loadProjects();
  }

  /** برچسب سبک */
  styleLabel(style?: string | null): string {
    switch (style) {
      case 'modern':
        return 'مدرن';
      case 'neoclassical':
        return 'نئوکلاسیک';
      case 'classic':
        return 'کلاسیک';
      default:
        return '—';
    }
  }

  /** نام دسته‌بندی (اگر دسته یک شیء یا رشته باشد) */
  categoryName(project: IProject): string {
    const c = project.category;
    if (!c) return '—';
    return typeof c === 'string' ? c : c.name || '—';
  }

  formatDate(value?: string): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /** نمایش سریع در سایت */
  viewInSite(project: IProject): void {
    window.open(`${window.location.origin}/projects/${project._id}`, '_blank');
  }

  /** حذف با تأیید */
  confirmDelete(project: IProject): void {
    this.confirmDialog.confirm({
      message: `آیا از حذف پروژه‌ی «${project.title}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`,
      header: 'حذف پروژه',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'انصراف',
      accept: () => {
        this.projectService.adminDelete(project._id).subscribe({
          next: () => {
            this.toastr.success('پروژه با موفقیت حذف شد.');
            this.loadProjects();
          },
          error: () => this.toastr.error('حذف پروژه ممکن نشد.'),
        });
      },
    });
  }
}
