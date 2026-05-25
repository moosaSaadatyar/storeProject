import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

/**
 * This directive swaps the attached template for a spinner based upon some expression
 * @example `<mat-icon *appSpinOn="isLoading"></mat-icon>`
 */

@Directive({
  selector: '[appSpinOn]',
  standalone: true
})
export class SpinOnDirective {
  #color: ThemePalette = 'accent';
  #diameter: number = 18;
  #isSpinning: boolean | null = null; 
  #spinner: MatProgressSpinner = null;
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input()
  set appSpinOnColor(color: ThemePalette) {
    this.#color = color;
    this.#spinner && (this.#spinner.color = color);
  }

  @Input()
  set appSpinOnDiameter(diameter: number) {
    this.#diameter = diameter;
    this.#spinner && (this.#spinner.diameter = diameter);
  }

  @Input()
  set appSpinOn(condition: boolean) {
    if (condition !== this.#isSpinning) {
      this.viewContainer.clear();
      this.#spinner = null;
      this.#isSpinning = condition;

      condition
        ? this.addSpinner()
        : this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private addSpinner() {
    const { instance } =
      this.viewContainer.createComponent(MatProgressSpinner);

    instance.diameter = this.#diameter;
    instance.color = this.#color;
    instance.mode = 'indeterminate';

    instance._elementRef.nativeElement
      .classList.add('spin-on-instance');

    this.#spinner = instance;
  }
}
