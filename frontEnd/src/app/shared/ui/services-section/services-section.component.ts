import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { CabinetServicesService } from '../../services/cabinet-services.service';
import { ICabinetService } from '../../../core/interface/service.interface';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * سکشن خدمات ما در صفحه خانه
 */
@Component({
  selector: 'app-services-section',
  imports: [CommonModule, RouterLink, TranslateModule, SkeletonModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css',
})
export class ServicesSectionComponent implements OnInit {
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
      error: () => (this.loading = false),
    });
  }
}
