import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[VlscfaBarDirective]',
})
export class VlscfabarDirective {
  @Input() inf!: number;
  @Input() sup!: number;
  @Input() val!: number;
  @Input() id!: number;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges() {
    let width: number;
    let color: string;

    if (this.id == 10) {
      if (this.val < this.inf) {
        color = '#29AABC';
      } else if (this.val > this.sup) {
        color = '#E62138';
      } else {
        color = '#E28605';
      }
    } else {
      if (this.val < this.inf || this.val > this.sup) {
        color = '#E62138';
      } else {
        color = '#29AABC';
      }
    }
    if (this.val == this.inf) {
      width = 2;
    } else if (this.val > this.sup) {
      width = 100;
    } else {
      width = ((this.val - this.inf) / (this.sup - this.inf)) * 100;
    }

    if (width < 2) width = 2;

    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      `${color}`,
    );
    this.renderer.setStyle(this.el.nativeElement, 'width', `${width}%`);
  }
}
