import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'request-btn',
  imports: [CommonModule,ButtonModule,TranslateModule],
  templateUrl: './request-btn.component.html',
  styleUrl: './request-btn.component.css',
})
export class RequestBtnComponent {

  private route = inject(Router)

  public navigate(){
    this.route.navigate(['/request'])
  }
}
