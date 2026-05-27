import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { BhrNavbarMenuComponent } from '../../core/component/lib/mo-navbar-menu/mo-navbar-menu.component';
import { MenuItem } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FA_TRANSLATIONS } from '../../core/static/constants/persian-context.constant';

@Component({
  selector: 'app-header',
  imports: [CommonModule, BhrNavbarMenuComponent, TranslocoModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  menuItem!: MenuItem[];

  public persianContense = FA_TRANSLATIONS
  constructor(
    private translocal: TranslocoService,
    private ch: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    const translatedText = computed(() => {
      return this.translocal.translate('HOME');
    }
  );
  console.log(translatedText);

  }
  
  ngAfterViewInit(){
    this.menuInIt();
  }

  private menuInIt() {
    this.menuItem = [
      {
        label:this.persianContense.HOME,
        url: '/',
        styleClass: 'text-white-50 px-2',
      },
      {
        label: this.persianContense.PRODUCTS,
        url: '/products',
        styleClass: 'text-white-50 px-2',
      },
      {
        label: this.persianContense.ABOUT,
        url: '/about',
        styleClass: 'text-white-50 px-2',
      },
      {
        label: this.persianContense.CONTACT,
        url: '/contact',
        styleClass: 'text-white-50 px-2',
      },
    ];
    this.ch.detectChanges();
  }
}
