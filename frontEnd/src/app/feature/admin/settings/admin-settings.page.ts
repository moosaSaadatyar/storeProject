import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { SettingsService } from '../../../shared/services/settings.service';
import {
  IHomeStep,
  IWhyUsItem,
} from '../../../core/interface/settings.interface';
import {
  PLACEHOLDER_IMAGE,
  resolveImageUrl,
} from '../../../core/static/helpers/image.helper';

/**
 * تنظیمات سایت — اطلاعات عمومی، تماس، شبکه‌های اجتماعی،
 * درباره ما، بنر خانه، «چرا ما» و مراحل همکاری
 */
@Component({
  selector: 'app-admin-settings-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SkeletonModule,
    TextareaModule,
  ],
  templateUrl: './admin-settings.page.html',
  styleUrl: './admin-settings.page.css',
})
export class AdminSettingsPage implements OnInit {
  private readonly settingsService = inject(SettingsService);
  private readonly toastr = inject(ToastrService);

  resolveUrl = resolveImageUrl;
  placeholder = PLACEHOLDER_IMAGE;

  loading = true;
  saving = false;

  /* ================= فیلدهای عمومی ================= */
  siteName = '';
  shortDescription = '';
  phone = '';
  whatsapp = '';
  email = '';
  address = '';
  mapLink = '';
  workHours = '';
  instagram = '';
  telegram = '';

  logoFile: File | null = null;
  currentLogo = '';

  /* ================= بخش درباره ما ================= */
  aboutLongText = '';
  experienceYears: number | null = null;
  /** نقاط قوت و ارزش‌ها — هر خط یک مورد */
  strengthsText = '';
  valuesText = '';

  /* ================= بخش بنر خانه ================= */
  heroTitle = '';
  heroSubtitle = '';
  heroDescription = '';
  heroImage = '';

  /* ================= چرا ما ================= */
  whyUs: IWhyUsItem[] = [];

  /* ================= مراحل همکاری ================= */
  steps: IHomeStep[] = [];

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.settingsService.adminGet().subscribe({
      next: (s) => {
        this.siteName = s.siteName || '';
        this.shortDescription = s.shortDescription || '';
        this.phone = s.phone || '';
        this.whatsapp = s.whatsapp || '';
        this.email = s.email || '';
        this.address = s.address || '';
        this.mapLink = s.mapLink || '';
        this.workHours = s.workHours || '';
        this.instagram = s.instagram || '';
        this.telegram = s.telegram || '';
        this.currentLogo = s.logo || '';

        this.aboutLongText = s.about?.longText || '';
        this.experienceYears = s.about?.experienceYears ?? null;
        this.strengthsText = (s.about?.strengths || []).join('\n');
        this.valuesText = (s.about?.values || []).join('\n');

        this.heroTitle = s.home?.heroTitle || '';
        this.heroSubtitle = s.home?.heroSubtitle || '';
        this.heroDescription = s.home?.heroDescription || '';
        this.heroImage = s.home?.heroImage || '';

        this.whyUs = (s.home?.whyUs || []).map((item) => ({ ...item }));
        this.steps = (s.home?.steps || []).map((item) => ({ ...item }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('بارگذاری تنظیمات ممکن نشد.');
      },
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.logoFile = input.files?.[0] || null;
  }

  /* ================= مدیریت لیست‌ها ================= */

  addWhyUsItem(): void {
    this.whyUs.push({ title: '', description: '', icon: '' });
  }

  removeWhyUsItem(index: number): void {
    this.whyUs.splice(index, 1);
  }

  addStep(): void {
    this.steps.push({ title: '', description: '' });
  }

  removeStep(index: number): void {
    this.steps.splice(index, 1);
  }

  /* ================= ذخیره ================= */

  save(): void {
    this.saving = true;

    const formData = new FormData();

    /* فیلدهای عمومی */
    formData.append('siteName', this.siteName.trim());
    formData.append('shortDescription', this.shortDescription.trim());
    formData.append('phone', this.phone.trim());
    formData.append('whatsapp', this.whatsapp.trim());
    formData.append('email', this.email.trim());
    formData.append('address', this.address.trim());
    formData.append('mapLink', this.mapLink.trim());
    formData.append('workHours', this.workHours.trim());
    formData.append('instagram', this.instagram.trim());
    formData.append('telegram', this.telegram.trim());

    /* لوگو */
    if (this.logoFile) formData.append('logo', this.logoFile);

    /* بخش about */
    formData.append('about.longText', this.aboutLongText.trim());
    if (this.experienceYears !== null && !isNaN(this.experienceYears)) {
      formData.append('about.experienceYears', String(this.experienceYears));
    }
    formData.append(
      'about.strengths',
      JSON.stringify(
        this.strengthsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      )
    );
    formData.append(
      'about.values',
      JSON.stringify(
        this.valuesText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      )
    );

    /* بخش home */
    formData.append('home.heroTitle', this.heroTitle.trim());
    formData.append('home.heroSubtitle', this.heroSubtitle.trim());
    formData.append('home.heroDescription', this.heroDescription.trim());
    formData.append('home.heroImage', this.heroImage.trim());

    formData.append(
      'home.whyUs',
      JSON.stringify(
        this.whyUs
          .filter((item) => item.title.trim() || item.description.trim())
          .map((item) => ({
            title: item.title.trim(),
            description: item.description.trim(),
            icon: item.icon.trim(),
          }))
      )
    );

    formData.append(
      'home.steps',
      JSON.stringify(
        this.steps
          .filter((item) => item.title.trim() || item.description.trim())
          .map((item) => ({
            title: item.title.trim(),
            description: item.description.trim(),
          }))
      )
    );

    this.settingsService.adminUpdate(formData).subscribe({
      next: () => {
        this.saving = false;
        this.logoFile = null;
        this.toastr.success('تنظیمات با موفقیت ذخیره شد.');
      },
      error: (err) => {
        this.saving = false;
        const message = err?.error?.message;
        this.toastr.error(message || 'ذخیره‌ی تنظیمات ممکن نشد.');
      },
    });
  }
}
