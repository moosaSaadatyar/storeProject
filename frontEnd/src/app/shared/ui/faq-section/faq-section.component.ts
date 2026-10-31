import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { FaqService } from '../../services/faq.service';
import { SeoService } from '../../../core/seo/seo.service';
import { IFaq } from '../../../core/interface/faq.interface';

/**
 * سکشن سوالات متداول در صفحه خانه
 */
@Component({
  selector: 'app-faq-section',
  imports: [CommonModule, TranslateModule, SkeletonModule],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.css',
})
export class FaqSectionComponent implements OnInit {
  private readonly faqService = inject(FaqService);
  private readonly seo = inject(SeoService);

  faqs: IFaq[] = [];
  loading = true;
  activeIndex: number | null = 0;

  ngOnInit(): void {
    this.faqService.list().subscribe({
      next: (data) => {
        this.faqs = data || [];
        this.loading = false;
        // داده ساختاریافته FAQ برای نتایج غنی گوگل
        this.seo.setJsonLd('faq', this.faqs.length ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: this.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        } : null);
      },
      error: () => (this.loading = false),
    });
  }

  toggle(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
