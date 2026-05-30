import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  OnInit,
} from '@angular/core';
import { MoNavbarMenuComponent } from '../../core/component/lib/mo-navbar-menu/mo-navbar-menu.component';
import { MenuItem } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FA_TRANSLATIONS } from '../../core/static/constants/persian-context.constant';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MoNavbarMenuComponent, TranslocoModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
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
        label: this.persianContense.PRODUCTS,
        styleClass: 'text-white-50 px-2',
        command: () => {
          this.router.navigate(['/products']);
        },
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
