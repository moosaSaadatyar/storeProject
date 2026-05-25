import { CommonModule } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[MaxNumber]',
  standalone: true
})

export class MaxNumberDirective {
  @Input('MaxNumber') maxValue: number;
  private el = inject(ElementRef)

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let value = this.el.nativeElement.value;

    if (+value > this.maxValue) {
      this.el.nativeElement.value = this.maxValue.toString();
    }
  }
}

