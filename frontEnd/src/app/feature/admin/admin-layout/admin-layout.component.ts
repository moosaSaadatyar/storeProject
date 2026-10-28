import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/service/auth/auth.service';
import { SiteSettingsService } from '../../../shared/services/site-settings.service';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * چیدمان پنل مدیریت — منوی کناری + نوار بالایی + خروجی مسیر
 */
@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly siteSettings = inject(SiteSettingsService);

  get adminName(): string {
    return this.authService.admin()?.name || '';
  }

  get adminEmail(): string {
    return this.authService.admin()?.email || '';
  }

  get logo(): string {
    return resolveImageUrl(this.siteSettings.s.logo) || '/logo/2.png';
  }

  get siteName(): string {
    return this.siteSettings.siteName || 'پنل مدیریت';
  }

  /** خروج از پنل */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
