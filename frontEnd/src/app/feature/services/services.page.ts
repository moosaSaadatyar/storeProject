import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { CabinetServicesService } from '../../shared/services/cabinet-services.service';
import { ICabinetService } from '../../core/interface/service.interface';
import { resolveImageUrl } from '../../core/static/helpers/image.helper';

/**
 * صفحه خدمات — فهرست کامل خدمات کابینت‌سازی
 */
@Component({
  selector: 'app-services-page',
  imports: [CommonModule, RouterLink, TranslateModule, SkeletonModule],
  templateUrl: './services.page.html',
  styleUrl: './services.page.css',
})
export class ServicesPage implements OnInit {
  private readonly cabinetServicesService = inject(CabinetServicesService);

  services: ICabinetService[] = [];
  loading = true;

  resolveUrl = resolveImageUrl;

  ngOnInit(): void {
    this.cabinetServicesService.list().subscribe({
      next: (data) => {
        this.services = data || [];
        this.loading = false;
      },
      error: () => {
        this.services = [];
        this.loading = false;
      },
    });
  }
}
