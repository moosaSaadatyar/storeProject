import { Component } from '@angular/core';
import { ProdactCard } from '../../dynamics/prodact-card/prodact-card';
import { ProductCard } from '../../dynamics/prodact-card/prodactes.interface';

@Component({
  selector: 'app-home-page',
  imports: [ProdactCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  products: ProductCard[] = [
    {
      id: 1,
      name: 'لپ‌تاپ گیمینگ',
      price: 45000000,
      imageUrl: '/frontEnd/public/images/labtob.jpg',
      description: '...',
    },
    {
      id: 2,
      name: 'موبایل هوشمند',
      price: 15000000,
      imageUrl: './frontEnd/public/images/1.jpg',
      description: '...',
    },
    {
      id: 2,
      name: 'موبایل هوشمند',
      price: 15000000,
      imageUrl: '../../../../../public/images/iphone.jpg',
      description: '...',
    },
  ];

  detailes(event: any) {
    console.log(event);
  }
}
