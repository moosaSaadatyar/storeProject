import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  private toastr = inject(ToastrService);

  success(message: string, title?: string) {
    return this.toastr.success(message, title);
  }

  error(message: string, title?: string) {
    return this.toastr.error(message, title);
  }

  info(message: string, title?: string) {
    return this.toastr.info(message, title);
  }

  warning(message: string, title?: string) {
    return this.toastr.warning(message, title);
  }
}
