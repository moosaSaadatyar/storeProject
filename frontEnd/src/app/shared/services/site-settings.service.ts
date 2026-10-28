import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SettingsService } from './settings.service';
import { IHomeStep, ISiteSettings, IWhyUsItem } from '../../core/interface/settings.interface';

/**
 * تنظیمات سایت با signal — یک بار بارگذاری می‌شود
 * هدر، فوتر و صفحات عمومی از این سرویس می‌خوانند.
 */
@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly settingsService = inject(SettingsService);

  readonly settings = signal<ISiteSettings | null>(null);
  readonly loading = signal(false);
  readonly ready = computed(() => !!this.settings());

  private loaded = false;

  /** بارگذاری یک‌باره (در ngOnInit لایه‌ی عمومی صدا زده می‌شود) */
  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.loading.set(true);

    this.settingsService
      .getPublic()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.settings.set(data),
        error: () => this.settings.set({}),
      });
  }

  /* دسترسی‌های راحت با مقدار پیش‌فرض */
  get s(): ISiteSettings {
    return this.settings() || {};
  }

  get phone(): string {
    return this.s.phone || '';
  }

  get whatsapp(): string {
    return this.s.whatsapp || '';
  }

  get instagram(): string {
    return this.s.instagram || '';
  }

  get telegram(): string {
    return this.s.telegram || '';
  }

  get address(): string {
    return this.s.address || '';
  }

  get workHours(): string {
    return this.s.workHours || '';
  }

  get mapLink(): string {
    return this.s.mapLink || '';
  }

  get siteName(): string {
    return this.s.siteName || '';
  }

  get heroImage(): string {
    return this.s.home?.heroImage || '';
  }

  get whyUs(): IWhyUsItem[] {
    return this.s.home?.whyUs || [];
  }

  get steps(): IHomeStep[] {
    return this.s.home?.steps || [];
  }
}
