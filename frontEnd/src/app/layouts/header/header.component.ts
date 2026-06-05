import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UserInfo } from './user-info/user-info';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    TranslocoModule,
    InputTextModule,
    ButtonModule,
    UserInfo,
    
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {


  
}
