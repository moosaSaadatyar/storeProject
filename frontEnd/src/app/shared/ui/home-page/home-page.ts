import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { AboutSectionComponent } from '../about-section/about-section.component';
import { CategoriesSectionComponent } from '../categories-section/categories-section.component';
import { LatestProjectsComponent } from '../latest-projects/latest-projects.component';
import { FeaturedProjectsComponent } from '../featured-projects/featured-projects.component';
import { ServicesSectionComponent } from '../services-section/services-section.component';
import { StepsSectionComponent } from '../steps-section/steps-section.component';
import { TestimonialsSectionComponent } from '../testimonials-section/testimonials-section.component';
import { FaqSectionComponent } from '../faq-section/faq-section.component';
import { ConsultationFormComponent } from '../consultation-form/consultation-form.component';

/**
 * صفحه خانه — ترکیب سکشن‌ها:
 * بنر، چرا ما، دسته‌بندی، جدیدترین نمونه‌کارها، پروژه‌های منتخب،
 * خدمات، مراحل همکاری، نظرات مشتریان، سوالات متداول، فرم مشاوره
 */
@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    AboutSectionComponent,
    CategoriesSectionComponent,
    LatestProjectsComponent,
    FeaturedProjectsComponent,
    ServicesSectionComponent,
    StepsSectionComponent,
    TestimonialsSectionComponent,
    FaqSectionComponent,
    ConsultationFormComponent,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
