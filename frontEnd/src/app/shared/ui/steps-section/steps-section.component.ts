import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SiteSettingsService } from '../../services/site-settings.service';
import { IHomeStep } from '../../../core/interface/settings.interface';

/**
 * سکشن مراحل همکاری در صفحه خانه
 * مراحل از تنظیمات سایت خوانده می‌شوند (با فال‌بک به متن‌های i18n)
 */
@Component({
  selector: 'app-steps-section',
  imports: [CommonModule, TranslateModule],
  templateUrl: './steps-section.component.html',
  styleUrl: './steps-section.component.css',
})
export class StepsSectionComponent {
  private readonly siteSettings = inject(SiteSettingsService);
  private readonly translate = inject(TranslateService);

  /** مراحل از تنظیمات — اگر خالی بود، فاکتوری برای فال‌بک در تمپلیت */
  get steps(): IHomeStep[] {
    const fromSettings = this.siteSettings.steps;
    if (fromSettings.length > 0) {
      return fromSettings;
    }
    return [
      { title: this.translate.instant('STEP_1_TITLE'), description: this.translate.instant('STEP_1_DESC') },
      { title: this.translate.instant('STEP_2_TITLE'), description: this.translate.instant('STEP_2_DESC') },
      { title: this.translate.instant('STEP_3_TITLE'), description: this.translate.instant('STEP_3_DESC') },
      { title: this.translate.instant('STEP_4_TITLE'), description: this.translate.instant('STEP_4_DESC') },
    ];
  }
}
