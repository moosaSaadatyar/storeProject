import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SiteSettingsService } from '../../services/site-settings.service';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * بنر صفحه خانه
 * متن‌ها و تصویر از تنظیمات سایت خوانده می‌شوند (با فال‌بک به i18n)
 */
@Component({
  selector: 'app-hero',
  imports: [CommonModule, TranslateModule, ButtonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  private readonly siteSettings = inject(SiteSettingsService);
  private readonly translate = inject(TranslateService);

  /** تصویر بنر — از تنظیمات، در غیر این صورت تصویر پیش‌فرض */
  get heroImage(): string {
    return resolveImageUrl(this.siteSettings.heroImage) || '/images/bg-Home.jpg';
  }

  /** زیرعنوان */
  get subtitle(): string {
    return this.siteSettings.s.home?.heroSubtitle || this.translate.instant('SHELTER_DESIGN_AND_MAKE');
  }

  /** عنوان اصلی (از تنظیمات — تک‌خطی) */
  get title(): string {
    return this.siteSettings.s.home?.heroTitle || '';
  }

  /** آیا از متن‌های تنظیمات استفاده می‌شود؟ */
  get hasSettingsTitle(): boolean {
    return !!this.title;
  }

  /** توضیحات */
  get description(): string {
    const fromSettings = this.siteSettings.s.home?.heroDescription;
    if (fromSettings) return fromSettings;
    return `${this.translate.instant('WITH_A_COMBINATION_OF_ART_QUALITY_AND_MODERN_MATERIALS')}, ${this.translate.instant('DESIGN_AND_IMPLEMENT_KITCHENS_TAILORED_TO_YOUR_HOME_AND_LIFESTYLE')}.`;
  }
}
