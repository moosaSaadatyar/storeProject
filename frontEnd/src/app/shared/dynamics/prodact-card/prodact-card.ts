import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { IProductCard } from './prodactes.interface';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-product-card',
  templateUrl: './prodact-card.html',
  styleUrl: './prodact-card.css',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, TranslateModule],
})
export class ProdactCard {
  product = input.required<IProductCard>();

  detailsClick = output<IProductCard>();
  addToCartClick = output<IProductCard>();
  translate = inject(TranslateService);

  onDetails() {
    this.detailsClick.emit(this.product());
  }

  onAddToCart() {
    this.addToCartClick.emit(this.product());
  }

  getDiscount(oldPrice: number, price: number): number {
    if (!oldPrice || oldPrice <= price) return 0;

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }
}
