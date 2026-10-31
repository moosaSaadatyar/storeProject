import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './core/seo/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  translate = inject(TranslateService);

  constructor() {
    // راه‌اندازی سرویس سئو (اشتراک‌گذاری رویدادهای روتر برای title/meta هر صفحه)
    inject(SeoService);
    this.translate.setDefaultLang('fa');
    this.translate.use('fa');
  }
}
