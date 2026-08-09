import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'request-btn',
  imports: [CommonModule,ButtonModule,TranslateModule],
  templateUrl: './request-btn.component.html',
  styleUrl: './request-btn.component.css',
})
export class RequestBtnComponent {

}
