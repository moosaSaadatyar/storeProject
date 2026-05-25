import { Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { IInputTextConfig } from '../../component/lib/mo-input-text/mo-input-text.interface';
import { ReplaySubject, Subscription } from 'rxjs';




@Injectable({
  providedIn: 'root',
})

export class RequierdFiledService  {



  public labelHandle(
    config: IInputTextConfig | any
  ): void {
    if (config) {
      config.label
        ? (config.inputClass = (config.inputClass ?? '') + ' order-1')
        : (config.containerClass = config.containerClass ?? '' + ' p-float-label');
    }
  }

  public addRequiredStar(
    config: { labelClass?: string; requiredStar?: boolean },
    control: AbstractControl
  ): void {
    if (config) {
      if (
        (config?.requiredStar ?? true) &&
        (control.hasValidator(Validators.required) || control.errors?.['required'])
      ) {
        config.labelClass = (config.labelClass ?? '') + ' cus-required-star';
      }
    }
  }


   public handleEvents(eventsList: string[], comp: unknown, configs: Object): Subscription {
    const subscription = new Subscription();
    if (comp) {
      for (const eventName of eventsList) {
        if (configs?.[eventName]) {
          subscription.add(
            comp[eventName].asObservable().subscribe(event => {
              (configs?.[eventName] as ReplaySubject<any>).next(event);
            })
          );
        }
      }
    }

    return subscription;
  }

}

