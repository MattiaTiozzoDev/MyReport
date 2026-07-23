import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';

@Component({
  selector: 'intluc-ending-page-2',
  imports: [PageFooter, PageHeader],
  templateUrl: './intluc-ending-page-2.html',
  styleUrl: './intluc-ending-page-2.scss',
})
export class IntlucEndingPage2 {
  @Input() page;
}
