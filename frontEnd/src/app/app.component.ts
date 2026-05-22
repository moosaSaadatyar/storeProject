import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './service-api.service';
import { HeaderComponent } from './core/layouts/header/header.component';
import { Footer } from './core/layouts/footer/footer';
import { HomePage } from './shared/ui/home-page/home-page';

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

  
  ngOnInit() {
    // this.api.getHello().subscribe(res => {
    //   this.message = res.message;
    // });
  }
}
