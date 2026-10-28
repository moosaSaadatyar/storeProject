import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Footer } from '../footer/footer';
import { SiteSettingsService } from '../../shared/services/site-settings.service';

@Component({
  selector: 'app-public-layout',
  imports: [HeaderComponent, Footer, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css',
})
export class PublicLayoutComponent implements OnInit {
  private readonly siteSettings = inject(SiteSettingsService);

  /**
   * بارگذاری تنظیمات سایت (هدر، فوتر، خانه و سایر صفحات از آن استفاده می‌کنند)
   */
  ngOnInit(): void {
    this.siteSettings.load();
  }
}
