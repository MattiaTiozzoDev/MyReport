import { Component, Input } from '@angular/core';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { VlscfaTable } from '../../shared/vlscfa-table/vlscfa-table';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription, tap } from 'rxjs';
import { VlscfaTableService } from '../../../services/vlscfa-table.service';
import { RoundedValuePipe } from '../../../pipes/rounded-value.pipe';
import { VlscfabarDirective } from '../../../directives/vlscfabar.directive';
import { NgClass, TitleCasePipe } from '@angular/common';
import { CustomersDataService } from '../../../services/customers-data.service';

@Component({
  selector: 'intluc-table-page',
  imports: [
    PageFooter,
    PageHeader,
    DateTransformPipe,
    RoundedValuePipe,
    TitleCasePipe,
    VlscfabarDirective,
    NgClass,
  ],
  templateUrl: './intluc-table-page.html',
  styleUrl: './intluc-table-page.scss',
})
export class IntlucTablePage {
  public data: any;
  public tablesSubscription: Subscription;

  @Input() customer: any;

  @Input() page: string;

  constructor(private customerservice: CustomersDataService) {}

  ngOnInit(): void {
    this.tablesSubscription = this.customerservice.$customerData
      .pipe(
        tap((customerData) => {
          this.data = customerData.values;
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.tablesSubscription.unsubscribe();
  }
}
