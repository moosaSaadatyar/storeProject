import { Component, inject, OnInit } from '@angular/core';
import { ProdactCard } from '../../dynamics/prodact-card/prodact-card';
import { GetProductService } from '../../services/get-product.service';
import { IProductCard } from '../../dynamics/prodact-card/prodactes.interface';

@Component({
  selector: 'app-home-page',
  imports: [ProdactCard],
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
      next: (data:any) => {
        console.log(data);
        this.products = data.products
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
