import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { RequestBtnComponent } from './request-btn/request-btn.component';
import { MoNavbarMenuComponent } from '../../core/component/lib/mo-navbar-menu/mo-navbar-menu.component';

@Component({
  selector: 'app-header',
  imports: [
    MoNavbarMenuComponent,
    RequestBtnComponent,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  menuItem: MenuItem[] = [];

  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.menuInIt();
    this.translate.onLangChange.subscribe(() => this.menuInIt());
  }

  /**
   * آیتم‌های منوی اصلی.
   *
   * نکته: در PrimeNG 21 قالب آیتم پیش‌فرض، مقدار `label` را به‌صورت خام
   * نمایش می‌دهد، بنابراین label در اینجا ترجمه می‌شود و با تغییر زبان
   * منو دوباره ساخته می‌شود. ناوبری با خاصیت `routerLink` انجام می‌شود
   * (خاصیت قدیمی `route` در PrimeNG 21 دیگر وجود ندارد).
   *
   * مسیرهای /services و /about و /contact در مراحل بعدی پیاده‌سازی می‌شوند.
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
