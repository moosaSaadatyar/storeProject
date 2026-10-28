import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'mo-navbar-menu',
  templateUrl: './mo-navbar-menu.component.html',
  styleUrls: ['./mo-navbar-menu.component.css'],
  standalone: true,
  imports: [
    MenubarModule,
  ],
})
export class MoNavbarMenuComponent implements OnInit {
  @Input()
  public items!: MenuItem[];

  ngOnInit() {}
}
