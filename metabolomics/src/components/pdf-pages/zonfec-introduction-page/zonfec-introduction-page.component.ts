import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'zonfec-introduction-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './zonfec-introduction-page.component.html',
  styleUrl: './zonfec-introduction-page.component.scss',
})
export class ZonfecIntroductionPageComponent {
  @Input() page: string;
}
