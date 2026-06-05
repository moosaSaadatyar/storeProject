import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './service-api.service';
import { Footer } from './layouts/footer/footer';
import { HeaderComponent } from './layouts/header/header.component';
import { NaveMenu } from './layouts/nave-menu/nave-menu';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, Footer, RouterOutlet, NaveMenu],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontEnd';
  message: string = '';

  private api = inject(ApiService);

  ngOnInit() {
    // this.api.getHello().subscribe(res => {
    //   this.message = res.message;
    // });
  }
}
