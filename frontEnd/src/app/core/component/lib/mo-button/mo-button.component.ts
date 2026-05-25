import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpinOnDirective } from '../../../directives/spin-on-directive/spin-on.directive';

@Component(
  {
    selector: 'mo-button',
    templateUrl: './mo-button.component.html',
    styleUrls: ['./mo-button.component.css'],
    standalone:true,
    imports: [
      CommonModule,
      SpinOnDirective,
      ButtonModule,
      RippleModule
    ],
  }
)
export class BhrButtonComponent
{
  @Input()
  public btnTitle: string;

  @Input()
  public btnpTooltip?: string;

  @Input()
  public btnDisabled?: boolean;

  @Input()
  public btnType?: 'submit' | 'button' | 'reset';

  @Input()
  public buttonClass?: string;

  @Input()
  public icon?: string;

  @Input()
  public iconPlacement?: 'start' | 'end';

  @Input()
  public spinner?: boolean;

  @Input()
  public spinnerColor?: 'accent' | 'primary' | 'warn';

  @Output()
  public btnClick = new EventEmitter();

  public clickHandler(event)
  {
    this.btnClick.emit(event)
  }

}
