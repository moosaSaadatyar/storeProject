import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../../core/interface/category.interface';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * سکشن دسته‌بندی انواع کابینت در صفحه خانه
 */
@Component({
  selector: 'app-categories-section',
  imports: [CommonModule, RouterLink, TranslateModule, SkeletonModule],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.css',
})
export class CategoriesSectionComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  categories: ICategory[] = [];
  loading = true;

  resolveUrl = resolveImageUrl;

  ngOnInit(): void {
    this.categoryService.list().subscribe({
      next: (data) => {
        this.categories = data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
