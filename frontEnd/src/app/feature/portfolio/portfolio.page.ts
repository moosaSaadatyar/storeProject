import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ProjectCard } from '../../shared/dynamics/project-card/project-card';
import { ProjectService } from '../../shared/services/project.service';
import { CategoryService } from '../../shared/services/category.service';
import { ICategory } from '../../core/interface/category.interface';
import {
  IProject,
  PROJECT_SPACES,
  PROJECT_STYLES,
} from '../../core/interface/project.interface';

/**
 * صفحه پورتفولیو — گالری نمونه‌کارها با فیلتر (دسته / سبک / فضای اجرا) و صفحه‌بندی
 */
@Component({
  selector: 'app-portfolio-page',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    PaginatorModule,
    SelectModule,
    SkeletonModule,
    ProjectCard,
  ],
  templateUrl: './portfolio.page.html',
  styleUrl: './portfolio.page.css',
})
export class PortfolioPage implements OnInit, OnDestroy {
  private readonly projectService = inject(ProjectService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);

  private subscriptions: Subscription[] = [];
  private projectsSub?: Subscription;

  categories: ICategory[] = [];

  /** گزینه‌های سبک */
  readonly styleOptions = PROJECT_STYLES.map((value) => ({
    value,
    label:
      value === 'modern'
        ? 'مدرن'
        : value === 'neoclassical'
          ? 'نئوکلاسیک'
          : 'کلاسیک',
  }));

  /** گزینه‌های فضای اجرا */
  readonly spaceOptions = PROJECT_SPACES.map((value) => ({
    value,
    label: this.spaceLabel(value),
  }));

  projects: IProject[] = [];
  total = 0;
  loading = true;

  page = 1;
  readonly limit = 9;

  /* فیلترها — null یعنی «همه» */
  categorySlug: string | null = null;
  style: string | null = null;
  space: string | null = null;

  ngOnInit(): void {
    this.subscriptions.push(
      this.categoryService.list().subscribe({
        next: (data) => (this.categories = data || []),
        error: () => (this.categories = []),
      })
    );

    // فیلتر اولیه از query string (مثلاً ورود از سکشن دسته‌بندی صفحه خانه)
    // queryParamMap حداقل یک بار (با پارامترهای فعلی) emit می‌شود،
    // بنابراین بارگذاری اولیه هم از همینجا انجام می‌شود.
    this.subscriptions.push(
      this.route.queryParamMap.subscribe((params) => {
        const category = params.get('category');
        if (category !== this.categorySlug) {
          this.categorySlug = category;
          this.page = 1;
        }
        this.loadProjects();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.projectsSub?.unsubscribe();
  }

  spaceLabel(value: string): string {
    const map: Record<string, string> = {
      kitchen: 'آشپزخانه',
      wardrobe: 'کمد دیواری',
      closet: 'کمد لباس',
      island: 'جزیره',
      office: 'اداری',
      living: 'نشیمن',
    };
    return map[value] || value;
  }

  loadProjects(): void {
    this.loading = true;
    this.projectsSub?.unsubscribe();
    this.projectsSub = this.projectService
      .list({
        category: this.categorySlug || undefined,
        style: this.style || undefined,
        space: this.space || undefined,
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

  /** تغییر فیلتر */
  onFilterChange(): void {
    this.page = 1;
    this.loadProjects();
  }

  /** پاک کردن فیلترها */
  clearFilters(): void {
    this.categorySlug = null;
    this.style = null;
    this.space = null;
    this.page = 1;
    this.loadProjects();
  }

  hasActiveFilters(): boolean {
    return !!(this.categorySlug || this.style || this.space);
  }

  /** صفحه‌بندی */
  onPageChange(event: { page: number; rows: number }): void {
    this.page = event.page + 1;
    this.loadProjects();
  }
}
