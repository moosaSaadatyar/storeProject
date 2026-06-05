import { Component, inject, OnInit } from '@angular/core';
import { ProdactCard } from '../../dynamics/prodact-card/prodact-card';
import { ProductCard } from '../../dynamics/prodact-card/prodactes.interface';
import { GetProductService } from '../../services/get-product.service';

@Component({
  selector: 'app-home-page',
  imports: [ProdactCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  private getProductService = inject(GetProductService);

  ngOnInit(): void {
    this.getProduct();
  }

  products: ProductCard[] = [];

  getProduct() {
    this.getProductService.read().subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }
  detailes(event: any) {
    console.log(event);
  }
}
