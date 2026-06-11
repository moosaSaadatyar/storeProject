import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MoNavbarMenuComponent } from '../../core/component/lib/mo-navbar-menu/mo-navbar-menu.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nave-menu',
  imports: [CommonModule, MoNavbarMenuComponent],
  standalone: true,
  templateUrl: './nave-menu.html',
  styleUrl: './nave-menu.css',
})
export class NaveMenu implements OnInit {
  menuItem!: MenuItem[];

  constructor(
    private router: Router,
    private translate: TranslateService,
  ) {}


  ngOnInit(): void {
    this.menuInIt();
  }

  private menuInIt() {
    this.menuItem = [
      {
        label: this.translate.instant('HOME'),
        styleClass: 'text-white-50 px-2',
        command: () => {
          this.router.navigate(['/home']);
        },
      },
      {
        label: this.translate.instant('PRODUCTS_MANAGMENT'),
        styleClass: 'text-white-50 px-2',
        items: [
          {
            label: this.translate.instant('PRODUCTS_ADD'),
            styleClass: 'text-white-50 px-2',
            command: () => {
              this.router.navigate(['/products']);
            },
          },
          {
            label: this.translate.instant('PRODUCTS_REPORT'),
            styleClass: 'text-white-50 px-2',
            command: () => {
              this.router.navigate(['/products']);
            },
          },
          {
            label: this.translate.instant('USER_INFORMATION'),
            styleClass: 'text-white-50 px-2',
            command: () => {
              this.router.navigate(['/']);
            },
          },
        ],
      },
      {
        label: this.translate.instant('PRODUCTS_TYPE'),
        styleClass: 'text-white-50 px-2',
        items: [
          {
            label: this.translate.instant('PRODUCTS_TYPE'),
            styleClass: 'text-white-50 px-2',
            command: () => {},
          },
          {
            label: this.translate.instant('PRODUCTS_TYPE'),
            styleClass: 'text-white-50 px-2',
            command: () => {},
          },
          {
            label: this.translate.instant('PRODUCTS_TYPE'),
            styleClass: 'text-white-50 px-2',
            command: () => {},
          },
        ],
      },
      {
        label: this.translate.instant('ABOUT'),
        styleClass: 'text-white-50 px-2',

        command: () => {
          this.router.navigate(['/about']);
        },
      },
      {
        label: this.translate.instant('CONTACT'),
        styleClass: 'text-white-50 px-2',
        command: () => {
          this.router.navigate(['/contact']);
        },
      },
    ];
  }
}
