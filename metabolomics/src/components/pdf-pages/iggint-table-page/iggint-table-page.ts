import { Component, input, Input } from '@angular/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IggintTable } from '../../shared/iggint-table/iggint-table';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';

@Component({
  selector: 'iggint-table-page',
  imports: [
    PageFooter,
    PageHeader,
    TranslatePipe,
    IggintTable,
    DateTransformPipe,
  ],
  templateUrl: './iggint-table-page.html',
  styleUrl: './iggint-table-page.scss',
})
export class IggintTablePage {
  @Input() page;
  @Input() tables: any[];
  @Input() last: boolean = false;
  @Input() customer: any;
}
