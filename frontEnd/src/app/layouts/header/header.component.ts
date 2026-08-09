import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UserInfo } from './user-info/user-info';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RequestBtnComponent } from './request-btn/request-btn.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MoNavbarMenuComponent } from '../../core/component/lib/mo-navbar-menu/mo-navbar-menu.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    RequestBtnComponent,
    TranslateModule,
    MoNavbarMenuComponent,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  menuItem!: MenuItem[];

  constructor(
    private router: Router,
    private translate: TranslateService,
  ) {}
  
  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.menuInIt();
    });
  }

  private menuInIt() {
    this.menuItem = [
      {
        label: this.translate.instant('HOME'),
        command: () => {
          this.router.navigate(['/home']);
        },
      },
      {
        label: this.translate.instant('PRODUCTS_MANAGMENT'),
        items: [
          {
            label: this.translate.instant('PRODUCTS_ADD'),
            command: () => {
              this.router.navigate(['/products']);
            },
          },
          {
            label: this.translate.instant('PRODUCTS_REPORT'),
            command: () => {
              this.router.navigate(['/products']);
            },
          },
          {
            label: this.translate.instant('USER_INFORMATION'),
            command: () => {
              this.router.navigate(['/']);
            },
          },
        ],
      },
      {
        label: this.translate.instant('WORK_SAMPLE'),
       
      },
      {
        label: this.translate.instant('ABOUT'),
        command: () => {
          this.router.navigate(['/about']);
        },
      },
      {
        label: this.translate.instant('CONTACT'),
        command: () => {
          this.router.navigate(['/contact']);
        },
      },
    ];
  }
}
