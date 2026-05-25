import { Injectable } from '@angular/core';
import { NotifToast } from 'mo-ui/core/static/notif/notif-toast';

import { ToastrService } from 'ngx-toastr';
import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';
import { ActiveToast } from 'ngx-toastr/toastr/toastr.service';


const customOptions =
  {
    toastComponent: NotifToast,
    toastClass: 'notif confirm'
  };


@Injectable(
  {
    providedIn: 'root'
  }
)
export class NotifyService
{


  constructor(
    private toastService: ToastrService
  )
  {
  }


  /** show toast */
  public show(message?: string, title?: string, override?: Partial<IndividualConfig>, type?: string): ActiveToast<any>
  {
    return this.toastService.show(message, title, {...customOptions,...override}, type);
  }

  /** show successful toast */
  public success(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>
  {
    const activeToast = this.toastService.success(message, title, {...customOptions,...override});

    (activeToast.toastRef.componentInstance as NotifToast).config =
      {
        toastColorClass: 'bg-success',
        iconClass: 'notif__icon--success'
      };

    return activeToast;
  }

  /** show error toast */
  public error(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>
  {
    const activeToast = this.toastService.error(message, title, {...customOptions,...override});

    (activeToast.toastRef.componentInstance as NotifToast).config =
      {
        toastColorClass: 'bg-danger',
        iconClass: 'fa fa-times-circle text-white'
      };

    return activeToast;
  }

  /** show info toast */
  public info(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>
  {
    const activeToast = this.toastService.info(message, title, {...customOptions,...override});

    (activeToast.toastRef.componentInstance as NotifToast).config =
      {
        toastColorClass: 'bg-info',
        iconClass: 'fa fa-info-circle text-white'
      };

    return activeToast;
  }

  /** show warning toast */
  public warning(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>
  {
    const activeToast = this.toastService.warning(message, title, {...customOptions,...override});

    (activeToast.toastRef.componentInstance as NotifToast).config =
      {
        toastColorClass: 'bg-warning',
        iconClass: 'fa fa-exclamation-triangle text-white'
      };
    return activeToast;
  }

  /**
   * Remove all or a single toast by id
   */
  public clear(toastId?: number): void
  {
    return this.toastService.clear(toastId);
  }

  /**
   * Remove and destroy a single toast by id
   */
  public remove(toastId: number): boolean
  {
    return this.toastService.remove(toastId);
  }

  /**
   * Determines if toast message is already shown
   */
  public findDuplicate(title: string, message: string, resetOnDuplicate: boolean, countDuplicates: boolean): ActiveToast<any>
  {
    return this.toastService.findDuplicate(title, message, resetOnDuplicate, countDuplicates);
  }
}
