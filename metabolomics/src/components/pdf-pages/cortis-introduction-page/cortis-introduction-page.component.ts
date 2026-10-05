import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'cortis-introduction-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './cortis-introduction-page.component.html',
  styleUrl: './cortis-introduction-page.component.scss',
})
export class CortisIntroductionPageComponent {
  @Input() page: string;
}
