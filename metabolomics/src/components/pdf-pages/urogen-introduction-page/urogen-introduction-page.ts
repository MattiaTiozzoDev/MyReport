import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'urogen-introduction-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './urogen-introduction-page.html',
  styleUrl: './urogen-introduction-page.scss',
})
export class UrogenIntroductionPage {
  @Input() page: string;
}
