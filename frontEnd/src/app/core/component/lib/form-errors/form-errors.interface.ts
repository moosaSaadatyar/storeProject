import { AbstractControl } from '@angular/forms';

export interface IFormErrorConfig
{
  control: AbstractControl;
  errors?: Record<string, any> | ReadonlyMap<string, string>;
  touchedCheck?: boolean;
  dirtyCheck?: boolean;
  dirtyAndTouchedCheckControl?: AbstractControl;
}
