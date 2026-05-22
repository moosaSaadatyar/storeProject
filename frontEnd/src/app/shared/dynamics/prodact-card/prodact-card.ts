import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductCard } from './prodactes.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './prodact-card.html',
  styleUrl: './prodact-card.css',
  imports: [CommonModule],
})
export class ProdactCard {
  @Input() product!: ProductCard;
  @Output() proudactDetailes = new EventEmitter<any>();

  clickProduct(product: ProductCard) {
    this.proudactDetailes.emit(product);
  }
}
