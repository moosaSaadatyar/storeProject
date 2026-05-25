import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'mo-icon-button',
  templateUrl: './mo-icon-button.component.html',
  styleUrls: ['./mo-icon-button.component.css'],
  standalone: true,
  imports: [
    CommonModule,
   ButtonModule, RippleModule
  ],
})
export class BhrIconButtonComponent {
  @Input()
  public color: 'warn' | 'info' | 'success' | 'dark' | 'primary' | 'secondary' | 'danger';

  @Input()
  public disabled?: boolean;

  @Input()
  public tooltip?: boolean;

  @Input()
  public type?: 'submit' | 'button' | 'reset';

  @Input()
  public buttonClass?: string;

  @Input()
  public icon!: string;

  @Output()
  public btnClick = new EventEmitter();

  public clickHandler(event) {
    this.btnClick.emit(event);
  }

  get btnClass() {
    let className = '';
    switch (this.color) {
      case 'warn': {
        //statements;
        className = 'icon-btn-warn';
        break;
      }
      case 'info': {
        //statements;
        className = 'icon-btn-info';

        break;
      }
      case 'success': {
        //statements;
        className = 'icon-btn-success';

        break;
      }
      case 'dark': {
        //statements;
        className = 'icon-btn-dark';

        break;
      }
      case 'primary': {
        //statements;
        className = 'icon-btn-primary';

        break;
      }
      case 'secondary': {
        //statements;
        className = 'icon-btn-secondary';

        break;
      }
      case 'danger': {
        //statements;
        className = 'icon-btn-danger';

        break;
      }

      default: {
        //statements;
        className = 'icon-btn-primary';
        break;
      }
    }

    return `${className} ${this.buttonClass}`;
  }
}
