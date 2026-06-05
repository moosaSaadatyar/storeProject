import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MenuItem } from 'primeng/api';
import { FA_TRANSLATIONS } from '../../core/static/constants/persian-context.constant';
import { CommonModule } from '@angular/common';
import { MoNavbarMenuComponent } from '../../core/component/lib/mo-navbar-menu/mo-navbar-menu.component';

@Component({
  selector: 'nave-menu',
  imports: [CommonModule, MoNavbarMenuComponent],
  standalone: true,
  templateUrl: './nave-menu.html',
  styleUrl: './nave-menu.css',
})
export class NaveMenu implements OnInit {
  menuItem!: MenuItem[];

  public persianContense = FA_TRANSLATIONS;
  constructor(
    private translocal: TranslocoService,
    private router: Router,
    private ActivatedRout: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.menuInIt();
  }

  private menuInIt() {
    this.menuItem = [
      {
        label: this.persianContense.HOME,
        styleClass: 'text-white-50 px-2',
        command: () => {
          this.router.navigate(['/home']);
        },
      },
      {
        label: this.persianContense.PRODUCTS_MANAGMENT,
        styleClass: 'text-white-50 px-2',
        items: [
          {
            label: this.persianContense.PRODUCTS_ADD,
            styleClass: 'text-white-50 px-2',
            command: () => {
              this.router.navigate(['/products']);
            },
          },
          {
            label: this.persianContense.PRODUCTS_REPORT,
            styleClass: 'text-white-50 px-2',
            command: () => {
              this.router.navigate(['/products']);
            },
          },
          {
            label: this.persianContense.USER_INFORMATION,
            styleClass: 'text-white-50 px-2',
            command: () => {
              this.router.navigate(['/']);
            },
          },
        ],
      },
      {
        label: this.persianContense.PRODUCTS_TYPE,
        styleClass: 'text-white-50 px-2',
        items: [
          {
            label: this.persianContense.PRODUCTS_TYPE,
            styleClass: 'text-white-50 px-2',
            command: () => {},
          },
          {
            label: this.persianContense.PRODUCTS_TYPE,
            styleClass: 'text-white-50 px-2',
            command: () => {},
          },
          {
            label: this.persianContense.PRODUCTS_TYPE,
            styleClass: 'text-white-50 px-2',
            command: () => {},
          },
        ],
      },
      {
        label: this.persianContense.ABOUT,
        styleClass: 'text-white-50 px-2',

        command: () => {
          this.router.navigate(['/about']);
        },
      },
      {
        label: this.persianContense.CONTACT,
        styleClass: 'text-white-50 px-2',
        command: () => {
          this.router.navigate(['/contact']);
        },
      },
    ];
  }
}
