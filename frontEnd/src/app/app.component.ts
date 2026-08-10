import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './service-api.service';
import { Footer } from './layouts/footer/footer';
import { HeaderComponent } from './layouts/header/header.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, Footer, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontEnd';
  message: string = '';

  private api = inject(ApiService);
  translate = inject(TranslateService);

  constructor() {
    this.translate.setDefaultLang('fa');
    this.translate.use('fa');
  }

  ngOnInit() {

  }
}
