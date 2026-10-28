import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CabinetServicesService } from '../../../shared/services/cabinet-services.service';
import { ICabinetService } from '../../../core/interface/service.interface';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * مدیریت خدمات — لیست + فرم افزودن/ویرایش
 */
@Component({
  selector: 'app-admin-services-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SkeletonModule,
    ToggleSwitchModule,
    TagModule,
    TextareaModule,
    ConfirmDialogModule,
  ],
  templateUrl: './admin-services.page.html',
  styleUrl: './admin-services.page.css',
})
export class AdminServicesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly cabinetServicesService = inject(CabinetServicesService);
  private readonly confirmDialog = inject(ConfirmationService);

  resolveUrl = resolveImageUrl;

  services: ICabinetService[] = [];
  loading = true;
  saving = false;

  /** خدمت در حال ویرایش (null = حالت افزودن) */
  editing: ICabinetService | null = null;

  imageFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    details: [''],
    features: [''], // هر خط یک ویژگی
    sortOrder: [0],
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.cabinetServicesService.adminList({ limit: 100 }).subscribe({
      next: (data) => {
        this.services = data?.items || [];
        this.loading = false;
      },
      error: () => {
        this.services = [];
        this.loading = false;
      },
    });
  }

  startEdit(service: ICabinetService): void {
    this.editing = service;
    this.imageFile = null;
    this.form.patchValue({
      title: service.title,
      description: service.description || '',
      details: service.details || '',
      features: (service.features || []).join('\n'),
      sortOrder: service.sortOrder ?? 0,
      isActive: service.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.editing = null;
    this.imageFile = null;
    this.form.reset({
      title: '',
      description: '',
      details: '',
      features: '',
      sortOrder: 0,
      isActive: true,
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0] || null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const formData = new FormData();
    formData.append('title', value.title.trim());
    formData.append('description', value.description.trim());
    formData.append('details', value.details.trim());
    formData.append('features', value.features.trim());
    formData.append('sortOrder', String(value.sortOrder));
    formData.append('isActive', String(value.isActive));
    if (this.imageFile) formData.append('image', this.imageFile);

    this.saving = true;
    const request$ = this.editing
      ? this.cabinetServicesService.adminUpdate(this.editing._id, formData)
      : this.cabinetServicesService.adminCreate(formData);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(
          this.editing ? 'خدمت به‌روزرسانی شد.' : 'خدمت ایجاد شد.'
        );
        this.resetForm();
        this.loadServices();
      },
      error: (err) => {
        this.saving = false;
        const message = err?.error?.message;
        this.toastr.error(message || 'ذخیره‌ی خدمت ممکن نشد.');
      },
    });
  }

  confirmDelete(service: ICabinetService): void {
    this.confirmDialog.confirm({
      message: `آیا از حذف خدمت «${service.title}» مطمئن هستید؟`,
      header: 'حذف خدمت',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'انصراف',
      accept: () => {
        this.cabinetServicesService.adminDelete(service._id).subscribe({
          next: () => {
            this.toastr.success('خدمت حذف شد.');
            if (this.editing?._id === service._id) this.resetForm();
            this.loadServices();
          },
          error: (err) => {
            const message = err?.error?.message;
            this.toastr.error(message || 'حذف خدمت ممکن نشد.');
          },
        });
      },
    });
  }
}
