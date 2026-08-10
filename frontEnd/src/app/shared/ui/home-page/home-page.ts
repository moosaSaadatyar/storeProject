import { Component, OnInit, inject } from '@angular/core';
import { IProductCard } from '../../dynamics/prodact-card/prodactes.interface';
import { GetProductService } from '../../services/get-product.service';
import { HeroComponent } from '../hero/hero.component';
import { AboutSectionComponent } from '../about-section/about-section.component';
import { SampleWorkComponent } from '../sample-work/sample-work.component';
import { RequestInterComponent } from '../request-inter/request-inter.component';

@Component({
  selector: 'app-home-page',
  imports: [HeroComponent, AboutSectionComponent, SampleWorkComponent,RequestInterComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  private getProductService = inject(GetProductService);

  products: IProductCard[] = [];

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.getProductService.read().subscribe({
      next: (data: any) => {
        this.products = data.products;
      },
    });
  }

  openDetails(event: any) {
    console.log(event);
  }

  addToCart(event: any) {
    console.log(event);
  }
}
