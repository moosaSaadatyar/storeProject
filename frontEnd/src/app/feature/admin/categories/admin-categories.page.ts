import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CategoryService } from '../../../shared/services/category.service';
import { ICategory } from '../../../core/interface/category.interface';
import { resolveImageUrl } from '../../../core/static/helpers/image.helper';

/**
 * مدیریت دسته‌بندی‌ها — لیست + فرم افزودن/ویرایش
 */
@Component({
  selector: 'app-admin-categories-page',
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
  templateUrl: './admin-categories.page.html',
  styleUrl: './admin-categories.page.css',
})
export class AdminCategoriesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly categoryService = inject(CategoryService);
  private readonly confirmDialog = inject(ConfirmationService);

  resolveUrl = resolveImageUrl;

  categories: ICategory[] = [];
  loading = true;
  saving = false;

  /** دسته‌ی در حال ویرایش (null = حالت افزودن) */
  editing: ICategory | null = null;

  imageFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: [''],
    description: [''],
    icon: [''],
    sortOrder: [0],
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.adminList({ limit: 100 }).subscribe({
      next: (data) => {
        this.categories = data?.items || [];
        this.loading = false;
      },
      error: () => {
        this.categories = [];
        this.loading = false;
      },
    });
  }

  /** شروع ویرایش */
  startEdit(category: ICategory): void {
    this.editing = category;
    this.imageFile = null;
    this.form.patchValue({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** بازگشت به حالت افزودن */
  resetForm(): void {
    this.editing = null;
    this.imageFile = null;
    this.form.reset({
      name: '',
      slug: '',
      description: '',
      icon: '',
      sortOrder: 0,
      isActive: true,
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0] || null;
  }

  /** ذخیره (ساخت یا ویرایش) */
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const formData = new FormData();
    formData.append('name', value.name.trim());
    formData.append('slug', value.slug.trim());
    formData.append('description', value.description.trim());
    formData.append('icon', value.icon.trim());
    formData.append('sortOrder', String(value.sortOrder));
    formData.append('isActive', String(value.isActive));
    if (this.imageFile) formData.append('image', this.imageFile);

    this.saving = true;
    const request$ = this.editing
      ? this.categoryService.adminUpdate(this.editing._id, formData)
      : this.categoryService.adminCreate(formData);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(
          this.editing
            ? 'دسته‌بندی به‌روزرسانی شد.'
            : 'دسته‌بندی ایجاد شد.'
        );
        this.resetForm();
        this.loadCategories();
      },
      error: (err) => {
        this.saving = false;
        const message = err?.error?.message;
        this.toastr.error(message || 'ذخیره‌ی دسته‌بندی ممکن نشد.');
      },
    });
  }

  /** حذف با تأیید */
  confirmDelete(category: ICategory): void {
    this.confirmDialog.confirm({
      message: `آیا از حذف دسته‌بندی «${category.name}» مطمئن هستید؟`,
      header: 'حذف دسته‌بندی',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'انصراف',
      accept: () => {
        this.categoryService.adminDelete(category._id).subscribe({
          next: () => {
            this.toastr.success('دسته‌بندی حذف شد.');
            if (this.editing?._id === category._id) this.resetForm();
            this.loadCategories();
          },
          error: (err) => {
            const message = err?.error?.message;
            this.toastr.error(message || 'حذف دسته‌بندی ممکن نشد.');
          },
        });
      },
    });
  }
}
