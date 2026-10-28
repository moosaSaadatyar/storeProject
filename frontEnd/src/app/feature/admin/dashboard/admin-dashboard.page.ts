import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { IConsultation } from '../../../core/interface/consultation.interface';

/**
 * داشبورد پنل مدیریت — آمار کلی + آخرین درخواست‌های مشاوره
 */
@Component({
  selector: 'app-admin-dashboard-page',
  imports: [CommonModule, RouterLink, SkeletonModule, TagModule],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.css',
})
export class AdminDashboardPage implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  loading = true;

  stats: {
    projects: { total: number; published: number; featured: number };
    categories: { total: number };
    services: { total: number };
    consultations: { total: number; new: number };
    contactMessages: { total: number; new: number };
    testimonials: { total: number; pending: number };
  } = {
    projects: { total: 0, published: 0, featured: 0 },
    categories: { total: 0 },
    services: { total: 0 },
    consultations: { total: 0, new: 0 },
    contactMessages: { total: 0, new: 0 },
    testimonials: { total: 0, pending: 0 },
  };

  recent: IConsultation[] = [];

  /** برچسب وضعیت مشاوره */
  statusLabel(status: string): string {
    switch (status) {
      case 'new':
        return 'جدید';
      case 'in-progress':
        return 'در حال پیگیری';
      case 'completed':
        return 'تکمیل‌شده';
      case 'cancelled':
        return 'لغو‌شده';
      default:
        return status;
    }
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
    const date = new Date(value);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  ngOnInit(): void {
    this.dashboardService.stats().subscribe({
      next: (data) => {
        this.stats = data;
        this.recent = data.recentConsultations || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
