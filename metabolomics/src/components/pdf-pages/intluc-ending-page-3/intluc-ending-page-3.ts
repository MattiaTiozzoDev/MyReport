import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';

@Component({
  selector: 'intluc-ending-page-3',
  imports: [PageFooter, PageHeader],
  templateUrl: './intluc-ending-page-3.html',
  styleUrl: './intluc-ending-page-3.scss',
})
export class IntlucEndingPage3 {
  @Input() page;
}
