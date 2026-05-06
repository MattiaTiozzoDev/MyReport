import { Component, Input } from '@angular/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'iggint-intro-page',
  imports: [PageFooter, PageHeader, TranslatePipe],
  templateUrl: './iggint-intro-page.html',
  styleUrl: './iggint-intro-page.scss',
})
export class IggintIntroPage {
  @Input() page;
}
