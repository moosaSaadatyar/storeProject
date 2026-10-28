import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { RequestBtnComponent } from './request-btn/request-btn.component';
import { MoNavbarMenuComponent } from '../../core/component/lib/mo-navbar-menu/mo-navbar-menu.component';
import { SiteSettingsService } from '../../shared/services/site-settings.service';
import { resolveImageUrl } from '../../core/static/helpers/image.helper';

@Component({
  selector: 'app-header',
  imports: [
    MoNavbarMenuComponent,
    RequestBtnComponent,
    RouterLink,
    TranslateModule,
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  menuItem: MenuItem[] = [];

  private translate = inject(TranslateService);
  private siteSettings = inject(SiteSettingsService);

  ngOnInit(): void {
    this.menuInIt();
    this.translate.onLangChange.subscribe(() => this.menuInIt());
  }

  /** لوگو از تنظیمات سایت (با جایگزین پیش‌فرض) */
  get logo(): string {
    return resolveImageUrl(this.siteSettings.s.logo) || '/logo/2.png';
  }

  get siteName(): string {
    return this.siteSettings.siteName;
  }

  /**
   * آیتم‌های منوی اصلی.
   *
   * نکته: در PrimeNG 21 قالب آیتم پیش‌فرض، مقدار `label` را به‌صورت خام
   * نمایش می‌دهد، بنابراین label در اینجا ترجمه می‌شود و با تغییر زبان
   * منو دوباره ساخته می‌شود. ناوبری با خاصیت `routerLink` انجام می‌شود
   * (خاصیت قدیمی `route` در PrimeNG 21 دیگر وجود ندارد).
   */
  private menuInIt() {
    this.menuItem = [
      {
        label: this.translate.instant('HOME'),
        routerLink: ['/home'],
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: this.translate.instant('SERVICES'),
        routerLink: ['/services'],
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: this.translate.instant('WORK_SAMPLE'),
        routerLink: ['/portfolio'],
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: this.translate.instant('ABOUT'),
        routerLink: ['/about'],
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: this.translate.instant('CONTACT'),
        routerLink: ['/contact'],
        routerLinkActiveOptions: { exact: true },
      },
    ];
  }
}
