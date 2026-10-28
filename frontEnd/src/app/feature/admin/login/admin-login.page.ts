import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/service/auth/auth.service';

/**
 * صفحه ورود پنل مدیریت
 */
@Component({
  selector: 'app-admin-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './admin-login.page.html',
  styleUrl: './admin-login.page.css',
})
export class AdminLoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  loading = false;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.loading = true;

    this.authService.login(value.email.trim(), value.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('ایمیل یا رمز عبور اشتباه است.');
      },
    });
  }
}
