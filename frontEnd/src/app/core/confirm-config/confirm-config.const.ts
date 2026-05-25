import { SweetAlertOptions } from 'sweetalert2';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const CONFIRM_CONFIG = (): () => SweetAlertOptions =>
{
  const translate = inject(TranslateService);

  return (options: SweetAlertOptions = {}) => (
    {
      title: translate.instant('WARNING'),
      icon: 'warning',
      customClass: {confirmButton: 'bg-success'} ,
      confirmButtonText: translate.instant('YES'),
      cancelButtonText: translate.instant('NO'),
      showCancelButton: true,
      showLoaderOnConfirm: true,
      ...options
    }
  );
}
