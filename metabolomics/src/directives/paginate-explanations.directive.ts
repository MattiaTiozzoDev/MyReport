import {
  Directive,
  ElementRef,
  AfterViewInit,
  Renderer2,
  inject,
} from '@angular/core';
import { PageHeader } from '../components/shared/page-header/page-header.component';
import { PageFooter } from '../components/shared/page-footer/page-footer';
import { createComponent, EnvironmentInjector } from '@angular/core';

const PAGE_HEIGHT = 842; // px A4
const PAGE_WIDTH = 595; // px A4

@Directive({
  selector: '[paginateExplanationsDirective]',
})
export class PaginateExplanations implements AfterViewInit {
  private renderer = inject(Renderer2);
  private injector = inject(EnvironmentInjector);
  private el = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    const container = this.el.nativeElement;
    const children = Array.from(container.children) as HTMLElement[];

    const pages: HTMLElement[] = [];
    let currentPage = this.createPage();
    let currentHeight = 0;

    children.forEach((block) => {
      const blockHeight = block.offsetHeight;

      // Se il blocco non entra nella pagina corrente, crea nuova pagina
      if (currentHeight + blockHeight > PAGE_HEIGHT - 50) {
        // margine per footer
        pages.push(currentPage);
        currentPage = this.createPage();
        currentHeight = 0;
      }

      // Sposta il blocco nella page-content
      const contentContainer = currentPage.querySelector('.page-content')!;
      this.renderer.appendChild(contentContainer, block);
      currentHeight += blockHeight;
    });

    // Aggiungi ultima pagina
    pages.push(currentPage);

    // Pulisci container originale e inserisci tutte le pagine
    this.renderer.setProperty(container, 'innerHTML', '');
    pages.forEach((page) => this.renderer.appendChild(container, page));
  }

  private createPage(): HTMLElement {
    const page = this.renderer.createElement('div');
    this.renderer.addClass(page, 'page-container');
    this.renderer.setStyle(page, 'width', `${PAGE_WIDTH}px`);
    this.renderer.setStyle(page, 'height', `${PAGE_HEIGHT}px`);
    this.renderer.setStyle(page, 'position', 'relative');
    this.renderer.setStyle(page, 'margin-bottom', '20px');

    // Header
    const header = createComponent(PageHeader, {
      hostElement: page,
      environmentInjector: this.injector,
    });

    // Content
    const content = this.renderer.createElement('div');
    this.renderer.addClass(content, 'page-content');
    this.renderer.setStyle(content, 'position', 'relative');
    this.renderer.setStyle(content, 'min-height', '700px'); // spazio per header/footer
    this.renderer.appendChild(page, content);

    // Footer
    const footer = createComponent(PageFooter, {
      hostElement: page,
      environmentInjector: this.injector,
    });

    return page;
  }
}
