import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'mo-header',
  imports: [CommonModule,TranslocoModule],
  templateUrl: './mo-header.html',
  styleUrl: './mo-header.css',
})
export class MoHeader {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() buttonLabel: string;
  @Input() buttonIcon: string;
  @Input() showButton: boolean;

  @Output() btnClick = new EventEmitter<void>();

  onBtnClick() {
    this.btnClick.emit();
  }
}
