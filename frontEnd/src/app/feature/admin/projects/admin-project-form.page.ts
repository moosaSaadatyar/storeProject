import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { CategoryService } from '../../../shared/services/category.service';
import { ProjectService } from '../../../shared/services/project.service';
import { ICategory } from '../../../core/interface/category.interface';
import {
  IProject,
  PROJECT_SPACES,
  PROJECT_STYLES,
} from '../../../core/interface/project.interface';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * فرم افزودن / ویرایش پروژه (multipart)
 */
@Component({
  selector: 'app-admin-project-form-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    SelectModule,
    SkeletonModule,
    ToggleSwitchModule,
    TextareaModule,
  ],
  templateUrl: './admin-project-form.page.html',
  styleUrl: './admin-project-form.page.css',
})
export class AdminProjectFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly categoryService = inject(CategoryService);
  private readonly projectService = inject(ProjectService);

  resolveUrl = resolveImageUrl;

  /** آیا حالت ویرایش است؟ */
  isEdit = false;
  project?: IProject;

  loading = false;
  saving = false;

  categories: ICategory[] = [];

  /* گزینه‌های سبک و فضای اجرا */
  readonly styleOptions = PROJECT_STYLES.map((value) => ({
    value,
    label: this.styleLabel(value),
  }));

  readonly spaceOptions = PROJECT_SPACES.map((value) => ({
    value,
    label: this.spaceLabel(value),
  }));

  /* فایل‌های انتخاب‌شده (تصویر جدید) */
  coverFile: File | null = null;
  galleryFiles: File[] = [];
  beforeFile: File | null = null;
  afterFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    shortDescription: [''],
    fullDescription: [''],
    category: [null as ICategory | null, [Validators.required]],
    style: [''],
    space: [''],
    bodyMaterial: [''],
    doorMaterial: [''],
    countertop: [''],
    hardware: [''],
    features: [''], // هر خط یک ویژگی
    areaValue: [''],
    areaUnit: ['متر مربع'],
    duration: [''],
    location: [''],
    isFeatured: [false],
    isPublished: [true],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  private loadCategories(): void {
    this.categoryService.adminList({ limit: 100 }).subscribe({
      next: (data) => (this.categories = data?.items || []),
      error: () => (this.categories = []),
    });
  }

  /** تشخیص حالت ویرایش + بارگذاری پروژه */
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEdit = true;
    this.loading = true;
    this.projectService.adminGetById(id).subscribe({
      next: (project) => {
        this.project = project;
        const category =
          typeof project.category === 'object' && project.category
            ? (project.category as ICategory)
            : null;
        this.form.patchValue({
          title: project.title,
          shortDescription: project.shortDescription || '',
          fullDescription: project.fullDescription || '',
          category,
          style: project.style || '',
          space: project.space || '',
          bodyMaterial: project.bodyMaterial || '',
          doorMaterial: project.doorMaterial || '',
          countertop: project.countertop || '',
          hardware: project.hardware || '',
          features: (project.features || []).join('\n'),
          areaValue: project.area?.value?.toString() || '',
          areaUnit: project.area?.unit || 'متر مربع',
          duration: project.duration || '',
          location: project.location || '',
          isFeatured: project.isFeatured,
          isPublished: project.isPublished,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('بارگذاری پروژه ممکن نشد.');
        this.router.navigate(['/admin/projects']);
      },
    });
  }

  /* =========================
     فایل‌ها
========================= */

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.coverFile = input.files?.[0] || null;
  }

  onBeforeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.beforeFile = input.files?.[0] || null;
  }

  onAfterSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.afterFile = input.files?.[0] || null;
  }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const incoming = Array.from(input.files || []);
    this.galleryFiles = [...this.galleryFiles, ...incoming].slice(0, 8);
    input.value = '';
  }

  removeGalleryFile(index: number): void {
    this.galleryFiles.splice(index, 1);
  }

  /* =========================
     ذخیره
========================= */

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // در حالت ایجاد: تصویر کاور یا حداقل یک تصویر گالری الزامی
    if (!this.isEdit && !this.coverFile && this.galleryFiles.length === 0) {
      this.toastr.error('لطفاً تصویر کاور یا حداقل یک تصویر گالری انتخاب کنید.');
      return;
    }

    const value = this.form.getRawValue();
    const formData = new FormData();

    formData.append('title', value.title.trim());
    formData.append('shortDescription', value.shortDescription.trim());
    formData.append('fullDescription', value.fullDescription.trim());
    formData.append('category', value.category?._id || '');
    formData.append('style', value.style);
    formData.append('space', value.space);
    formData.append('bodyMaterial', value.bodyMaterial.trim());
    formData.append('doorMaterial', value.doorMaterial.trim());
    formData.append('countertop', value.countertop.trim());
    formData.append('hardware', value.hardware.trim());
    formData.append('features', value.features.trim());
    if (value.areaValue.trim() !== '') {
      formData.append('areaValue', value.areaValue.trim());
      formData.append('areaUnit', value.areaUnit.trim());
    }
    formData.append('duration', value.duration.trim());
    formData.append('location', value.location.trim());
    formData.append('isFeatured', String(value.isFeatured));
    formData.append('isPublished', String(value.isPublished));

    /* فایل‌های جدید */
    if (this.coverFile) formData.append('coverImage', this.coverFile);
    this.galleryFiles.forEach((file) => formData.append('files', file));
    if (this.beforeFile) formData.append('beforeImage', this.beforeFile);
    if (this.afterFile) formData.append('afterImage', this.afterFile);

    this.saving = true;
    const request$ = this.isEdit && this.project
      ? this.projectService.adminUpdate(this.project._id, formData)
      : this.projectService.adminCreate(formData);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(
          this.isEdit
            ? 'پروژه با موفقیت به‌روزرسانی شد.'
            : 'پروژه با موفقیت ایجاد شد.'
        );
        this.router.navigate(['/admin/projects']);
      },
      error: () => (this.saving = false),
    });
  }

  /* =========================
     برچسب‌ها
========================= */

  styleLabel(value: string): string {
    switch (value) {
      case 'modern':
        return 'مدرن';
      case 'neoclassical':
        return 'نئوکلاسیک';
      case 'classic':
        return 'کلاسیک';
      default:
        return value;
    }
  }

  spaceLabel(value: string): string {
    const map: Record<string, string> = {
      kitchen: 'آشپزخانه',
      wardrobe: 'کمد دیواری',
      closet: 'کمد لباس',
      island: 'جزیره',
      office: 'اداری',
      living: 'نشیمن',
    };
    return map[value] || value;
  }
}
