import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'gutsys-introduction-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './gutsys-introduction-page.component.html',
  styleUrl: './gutsys-introduction-page.component.scss',
})
export class GutsysIntroductionPageComponent {
  @Input() page: string;
}
