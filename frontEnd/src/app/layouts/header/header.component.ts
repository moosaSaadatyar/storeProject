import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UserInfo } from './user-info/user-info';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    UserInfo,
    TranslateModule
    
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {


  
}
