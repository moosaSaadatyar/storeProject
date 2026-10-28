import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ContactService } from '../../shared/services/contact.service';
import { SiteSettingsService } from '../../shared/services/site-settings.service';

/**
 * صفحه تماس با ما — اطلاعات تماس (از تنظیمات) + فرم ارسال پیام
 */
@Component({
  selector: 'app-contact-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css',
})
export class ContactPage {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly contactService = inject(ContactService);
  private readonly siteSettings = inject(SiteSettingsService);

  submitting = false;

  /* اطلاعات تماس از تنظیمات سایت */
  get phone(): string {
    return this.siteSettings.phone;
  }

  get whatsappLink(): string {
    return this.siteSettings.whatsapp
      ? `https://wa.me/${this.siteSettings.whatsapp}`
      : '';
  }

  get email(): string {
    return this.siteSettings.s.email || '';
  }

  get address(): string {
    return this.siteSettings.address;
  }

  get mapLink(): string {
    return this.siteSettings.mapLink;
  }

  get workHours(): string {
    return this.siteSettings.workHours;
  }

  get instagram(): string {
    return this.siteSettings.instagram;
  }

  get telegram(): string {
    return this.siteSettings.telegram;
  }

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    email: ['', [Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const body: {
      fullName: string;
      phone: string;
      email?: string;
      subject?: string;
      message: string;
    } = {
      fullName: value.fullName.trim(),
      phone: value.phone.trim(),
      message: value.message.trim(),
    };
    if (value.email.trim()) body.email = value.email.trim();
    if (value.subject.trim()) body.subject = value.subject.trim();

    this.submitting = true;
    this.contactService.create(body).subscribe({
      next: () => {
        this.submitting = false;
        this.form.reset();
        this.toastr.success('پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.');
      },
      error: () => (this.submitting = false),
    });
  }
}
