import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mo-navbar-menu',
  templateUrl: './mo-navbar-menu.component.html',
  styleUrls: ['./mo-navbar-menu.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    TranslateModule,
    RouterLinkActive,
    RouterLink,
  ],
})
export class MoNavbarMenuComponent implements OnInit {
  @Input()
  public items!: MenuItem[];
  constructor(private router: Router) {}

  ngOnInit(): void {}
}
