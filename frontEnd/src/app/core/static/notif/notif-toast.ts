import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ToastPackage } from 'ngx-toastr';

export interface INotifInterface {
  toastColorClass: string;
  iconClass: string;
}

@Component({
  selector: 'notif-toast-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="notif__toast"
      [ngClass]="config.toastColorClass"
      (click)="dismiss()"
      role="status"
      aria-live="polite"
    >
      <div class="notif__wrapper">
        <div class="notif__icon">
          <i [class]="config.iconClass"></i>
        </div>

        <div class="notif__message">
          <div class="notif__title">{{ title }}</div>
          <div class="notif__body">{{ message }}</div>
        </div>
      </div>
    </div>
  `,
})
export class NotifToastComponent {
  /** تنظیمات ظاهری سفارشی شما */
  @Input() config: INotifInterface = {
    toastColorClass: 'bg-success',
    iconClass: 'notif__icon--success',
  };

  constructor(@Inject(ToastPackage) private toastPackage: ToastPackage) {}

  get title(): string {
    return (this.toastPackage.title as string) ?? '';
  }

  get message(): string {
    return (this.toastPackage.message as string) ?? '';
  }

  dismiss(): void {
    // این روش استاندارد بستن toast از داخل کامپوننت سفارشی است
    this.toastPackage.triggerTap();
    this.toastPackage.toastRef.close();
  }
}
