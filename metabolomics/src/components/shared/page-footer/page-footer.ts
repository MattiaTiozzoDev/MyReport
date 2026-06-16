import { Component, Input } from '@angular/core';

@Component({
  selector: 'metabolomics-page-footer',
  imports: [],
  templateUrl: './page-footer.html',
  styleUrl: './page-footer.scss',
})
export class PageFooter {
  @Input() page: string | number;
}
