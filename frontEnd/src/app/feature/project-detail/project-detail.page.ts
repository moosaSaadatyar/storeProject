import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ProjectCard } from '../../shared/dynamics/project-card/project-card';
import { ProjectService } from '../../shared/services/project.service';
import { IProject } from '../../core/interface/project.interface';
import {
  PLACEHOLDER_IMAGE,
  resolveImageUrl,
} from '../../core/static/helpers/image.helper';

/**
 * صفحه جزئیات پروژه / نمونه‌کار
 * گالری تصاویر (اصلی + بندانگشتی‌ها) + مشخصات فنی + قبل و بعد + پروژه‌های مرتبط
 */
@Component({
  selector: 'app-project-detail-page',
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ButtonModule,
    SkeletonModule,
    TagModule,
    ProjectCard,
  ],
  templateUrl: './project-detail.page.html',
  styleUrl: './project-detail.page.css',
})
export class ProjectDetailPage implements OnInit, OnDestroy {
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  private paramSub?: Subscription;

  project: IProject | null = null;
  loading = true;
  notFound = false;

  resolveUrl = resolveImageUrl;
  placeholder = PLACEHOLDER_IMAGE;

  /** URLهای رزولوشن‌شده‌ی گالری (کاور + تصاویر، بدون تکرار) */
  gallery: string[] = [];
  selectedIndex = 0;

  get hasBeforeAfter(): boolean {
    return !!(this.project?.beforeImage && this.project?.afterImage);
  }

  get styleLabel(): string {
    switch (this.project?.style) {
      case 'modern':
        return 'مدرن';
      case 'neoclassical':
        return 'نئوکلاسیک';
      case 'classic':
        return 'کلاسیک';
      default:
        return '';
    }
  }

  /** نام دسته‌بندی پروژه (اگر دسته یک شیء یا رشته باشد) */
  get categoryLabel(): string {
    const c = this.project?.category;
    if (!c) return '';
    return typeof c === 'string' ? c : c.name || '';
  }

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.notFound = true;
        this.loading = false;
        return;
      }
      this.loading = true;
      this.notFound = false;
      this.projectService.getById(id).subscribe({
        next: (data) => {
          this.project = data;
          const urls = [data.coverImage, ...(data.images || [])].filter(
            (url, index, arr) => !!url && arr.indexOf(url) === index
          );
          this.gallery = urls.map((url) => resolveImageUrl(url) || this.placeholder);
          this.selectedIndex = 0;
          this.loading = false;
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }
}
