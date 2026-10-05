import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'igafec-introduction-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './igafec-introduction-page.component.html',
  styleUrl: './igafec-introduction-page.component.scss',
})
export class IgafecIntroductionPageComponent {
  @Input() page: string;
}
