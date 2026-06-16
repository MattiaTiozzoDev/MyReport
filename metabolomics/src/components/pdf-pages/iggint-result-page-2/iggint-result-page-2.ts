import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'iggint-result-page-2',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './iggint-result-page-2.html',
  styleUrl: './iggint-result-page-2.scss',
})
export class IggintResultPage2 {
  @Input() page: string;
}
