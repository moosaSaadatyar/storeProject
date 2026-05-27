import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'mo-navbar-menu',
  templateUrl: './mo-navbar-menu.component.html',
  styleUrls: ['./mo-navbar-menu.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    TranslocoModule
  ],
  
})

export class BhrNavbarMenuComponent implements OnInit, OnChanges {
  @Input()
  public items!: MenuItem[];

  highlightedItems: MenuItem[] = [];
  activeMenuLabel: string | null = null;

  private _ch = inject(ChangeDetectorRef)

  private router = inject(Router)

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items?.length) {
      this.highlightedItems = this.items.map(item => {
        const newItem = { ...item };
        const originalCommand = item.command;
        newItem.command = (event: { item: MenuItem }) => {
          if (originalCommand) {
            if (event?.item) {
              delete (event.item as any).routerLink;
            }
            originalCommand(event);
            this._ch.detectChanges();
          }
        };

        delete newItem.routerLink;
        return newItem;
      });
    }
  }

}
