import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { IMoAlert } from './mo-alert.interface';


@Component(
  {
    selector: 'mo-alert[alertId]',
    standalone: true,
    imports: [
      CommonModule,
      TooltipModule
    ],
    templateUrl: './mo-alert.component.html',
    styleUrls: ['./mo-alert.component.css']
  }
)
export class MoAlertComponent
{

  @ContentChild('alertTitle')
  public alertTitle: TemplateRef<any>;

  @ContentChild('alertContent')
  public alertContent: TemplateRef<any>;

  @Input()
  public config: IMoAlert =
    {
      alertTitle: '',
      alertContent: ''
    };

  @Input()
  public alertId = 'alertId';

  @Output()
  public onClose = new EventEmitter<string>;

  public closeAlert(): void
  {
    this.onClose.emit(this.alertId);
  }
}
