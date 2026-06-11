import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { IProductCard } from './prodactes.interface';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './prodact-card.html',
  styleUrl: './prodact-card.css',
  imports: [CommonModule, TranslateModule],
})
export class ProdactCard {
  product = input.required<IProductCard>();

  detailsClick = output<IProductCard>();
  addToCartClick = output<IProductCard>();
translate = inject(TranslateService)

  onDetails() {


    this.detailsClick.emit(this.product());
  }

  onAddToCart() {
    this.addToCartClick.emit(this.product());
 
  }

  
}
