import { Component, Input } from '@angular/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'intluc-ending-page-1',
  imports: [PageFooter, PageHeader],
  templateUrl: './intluc-ending-page-1.html',
  styleUrl: './intluc-ending-page-1.scss',
})
export class IntlucEndingPage1 {
  @Input() page;
}
