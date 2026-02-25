import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';

@Component({
  selector: 'gutsys-indication-page',
  imports: [PageHeader, PageFooter, TranslatePipe, DateTransformPipe],
  templateUrl: './gutsys-indication-page.html',
  styleUrl: './gutsys-indication-page.scss',
})
export class GutsysIndicationPage {
  @Input() page: string;
  @Input() date: string;
}
