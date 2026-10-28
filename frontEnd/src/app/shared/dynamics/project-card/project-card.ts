import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProject } from '../../../core/interface/project.interface';
import { resolveImageUrl, PLACEHOLDER_IMAGE } from '../../../core/static/helpers/image.helper';

/**
 * کارت نمونه‌کار — تصویر کاور + عنوان + دسته + سبک
 * کلیک روی کارت به صفحه‌ی جزئیات پروژه می‌رود.
 */
@Component({
  selector: 'app-project-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  project = input.required<IProject>();

  resolveUrl = resolveImageUrl;

  placeholder = PLACEHOLDER_IMAGE;

  get categoryLabel(): string {
    const cat = this.project().category;
    return typeof cat === 'object' ? cat?.name || '' : '';
  }

  get categorySlug(): string {
    const cat = this.project().category;
    return typeof cat === 'object' ? cat?.slug || '' : '';
  }
}
