import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SiteSettingsService } from '../../shared/services/site-settings.service';
import { resolveImageUrl } from '../../core/static/helpers/image.helper';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  private readonly siteSettings = inject(SiteSettingsService);

  get siteName(): string {
    return this.siteSettings.siteName;
  }

  /** لوگو از تنظیمات (با جایگزین پیش‌فرض) */
  get logo(): string {
    return resolveImageUrl(this.siteSettings.s.logo) || '/logo/2.png';
  }

  /** متن معرفی کوتاه */
  get aboutText(): string {
    return this.siteSettings.s.shortDescription || '';
  }

  get phone(): string {
    return this.siteSettings.phone;
  }

  get whatsapp(): string {
    return this.siteSettings.whatsapp;
  }

  get whatsappLink(): string {
    return this.whatsapp ? `https://wa.me/${this.whatsapp}` : '';
  }

  get instagram(): string {
    return this.siteSettings.instagram;
  }

  get telegram(): string {
    return this.siteSettings.telegram;
  }

  /** نام کاربری اینستاگرام برای نمایش */
  get instagramHandle(): string {
    try {
      return new URL(this.instagram).hostname.replace(/^www\./, '') +
        new URL(this.instagram).pathname.replace(/\/$/, '');
    } catch {
      return this.instagram;
    }
  }

  get address(): string {
    return this.siteSettings.address;
  }

  get workHours(): string {
    return this.siteSettings.workHours;
  }
}
