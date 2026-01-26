import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[BarPointerDirective]',
})
export class BarPointerDirective implements OnChanges {
  @Input() value: number = 0; // valore corrente
  @Input() yellInf: number = 0; // valore minimo dell'intervallo
  @Input() yellSup: number = 100; // valore massimo dell'intervallo

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges() {
    const startMargin = 5; // margine sinistro minimo (%)
    const endMargin = 95; // margine sinistro massimo (%)
    let margin: number;

    if (this.value <= this.yellInf) {
      margin = 1;
    } else if (this.value >= this.yellSup) {
      margin = 94;
    } else {
      margin =
        startMargin +
        ((this.value - this.yellInf) / (this.yellSup - this.yellInf)) *
          (endMargin - startMargin);
    }

    this.renderer.setStyle(
      this.el.nativeElement,
      'margin-left',
      `calc(${margin}%`,
    );
  }
}
