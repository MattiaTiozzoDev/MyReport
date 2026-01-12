import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[hoverImg]',
})
export class HoverImgDirective implements OnInit {
  @Input('hoverImg') hoverPath!: string;

  private originalPath?: string;
  private imgEl!: HTMLImageElement | null;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    // prende solo l'img figlio diretto
    this.imgEl = this.host.nativeElement.querySelector(':scope > img');

    if (!this.imgEl) {
      return;
    }

    this.originalPath = this.imgEl.src;
  }

  @HostListener('mouseenter')
  onEnter() {
    if (this.imgEl && this.hoverPath) {
      this.imgEl.src = this.hoverPath;
    }
  }

  @HostListener('mouseleave')
  onLeave() {
    if (this.imgEl && this.originalPath) {
      this.imgEl.src = this.originalPath;
    }
  }
}
