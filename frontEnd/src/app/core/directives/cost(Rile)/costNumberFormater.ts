import { CommonModule } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[CostFormatter]',
  standalone: true
})
export class CostFormatterDirective {
  @Input('CostFormatter') condition: boolean = false;
  private el = inject(ElementRef)
  constructor() { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    if (this.condition) {
      let value = this.el.nativeElement.value;
      value = value.replace(/,/g, ''); // Remove existing commas
      if (!isNaN(value)) {
        this.el.nativeElement.value = this.formatNumber(value);
      }
    }
  }

  private formatNumber(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}


