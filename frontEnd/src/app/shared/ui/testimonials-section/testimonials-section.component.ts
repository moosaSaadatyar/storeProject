import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TestimonialService } from '../../services/testimonial.service';
import { ITestimonial } from '../../../core/interface/testimonial.interface';

/**
 * سکشن نظرات مشتریان در صفحه خانه (فقط موارد تأییدشده)
 */
@Component({
  selector: 'app-testimonials-section',
  imports: [CommonModule, TranslateModule, SkeletonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css',
})
export class TestimonialsSectionComponent implements OnInit {
  private readonly testimonialService = inject(TestimonialService);

  testimonials: ITestimonial[] = [];
  loading = true;

  ngOnInit(): void {
    this.testimonialService.list().subscribe({
      next: (data) => {
        this.testimonials = (data || []).slice(0, 3);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
