import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SiteSettingsService } from '../../shared/services/site-settings.service';

/**
 * صفحه درباره ما — محتوا از تنظیمات سایت (بخش about)
 */
@Component({
  selector: 'app-about-page',
  imports: [CommonModule, RouterLink, TranslateModule, ButtonModule],
  templateUrl: './about.page.html',
  styleUrl: './about.page.css',
})
export class AboutPage {
  private readonly siteSettings = inject(SiteSettingsService);

  get longText(): string {
    return this.siteSettings.s.about?.longText || '';
  }

  get experienceYears(): number {
    return this.siteSettings.s.about?.experienceYears || 0;
  }

  get strengths(): string[] {
    return this.siteSettings.s.about?.strengths || [];
  }

  get values(): string[] {
    return this.siteSettings.s.about?.values || [];
  }
}
