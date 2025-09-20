import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './service-api.service';
import { HeaderComponent } from './core/layouts/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontEnd';
  message: string = ''

  private api = inject(ApiService)

  ngOnInit() {
    // this.api.getHello().subscribe(res => {
    //   this.message = res.message;
    // });
  }
}
