import { Component, Input } from '@angular/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'intluc-intro-page',
  imports: [PageFooter, PageHeader],
  templateUrl: './intluc-intro-page.html',
  styleUrl: './intluc-intro-page.scss',
})
export class IntlucIntroPage {
  @Input() page;
}
