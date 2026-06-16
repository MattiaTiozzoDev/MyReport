import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';

@Component({
  selector: 'urogen-ending-page',
  imports: [PageHeader, PageFooter],
  templateUrl: './urogen-ending-page.html',
  styleUrl: './urogen-ending-page.scss',
})
export class UrogenEndingPage {
  @Input() page: string;
}
