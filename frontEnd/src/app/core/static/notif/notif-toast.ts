import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { INotifInterface } from './notif.interface';

@Component(
  {
    selector: 'notif-toast-component',
    styles: [],
    standalone: true,
    imports: [CommonModule],
    template: `
        <div  [@flyInOut]="animationState" 
          [ngClass]="config.toastColorClass" 
          (click)="tapToast()" class='notif__toast--success notif__toast'>
          <div class='notif__wrapper'>
            <div class='notif__icon'>
              <i [class]='config.iconClass' style='color: rgb(61, 199, 99);'></i>
            </div>
            <div class='notif__message'>

              <div>
                {{ title }}
              </div>

              <div>
                {{ message }}
              </div>

            </div>
          </div>
          <div
            class='notif__ripple'
            [class]='config.toastColorClass'>
          </div>
        </div>
    `,
    animations:
      [
        trigger(
          'flyInOut',
          [
            state('inactive', style({ opacity: 0 })),
            transition(
              'inactive => active',
              animate(
                '300ms ease-out',
                keyframes(
                  [
                    style(
                      {
                        opacity: 0,
                        bottom: '-15px',
                        'max-height': 0,
                        'max-width': 0,
                        'margin-top': 0
                      }
                    ),
                    style(
                      {
                        opacity: 0.8,
                        bottom: '-3px'
                      }
                    ),
                    style(
                      {
                        opacity: 1,
                        bottom: '0',
                        'max-height': '200px',
                        'margin-top': '12px',
                        'max-width': '400px'
                      }
                    )
                  ]
                )
              )
            ),
            state(
              'active',
              style(
                {
                  bottom: '0',
                  'max-height': '200px',
                  'margin-top': '12px',
                  'max-width': '400px'
                }
              )
            ),
            transition(
              'active => removed',
              animate(
                '300ms ease-out',
                keyframes(
                  [
                    style(
                      {
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    ),
                    style(
                      {
                        opacity: 0,
                        transform: 'translateY(25%)'
                      }
                    )
                  ]
                )
              )
            )
          ]
        )
      ]
  })
export class NotifToast extends Toast
{

  @Input()
  public config: INotifInterface =
    {
      toastColorClass: 'bg-success',
      iconClass: 'notif__icon--success'
    }



  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage
  )
  {
    super(toastrService, toastPackage);
  }

  animationState = 'active';

  override remove() {
    this.animationState = 'removed';

    setTimeout(() => super.remove(), 300);
  }
}
