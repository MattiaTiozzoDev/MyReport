import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { CustomersDataService } from '../../../services/customers-data.service';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';
import { NgClass } from '@angular/common';
import { RoundedValuePipe } from '../../../pipes/rounded-value.pipe';

@Component({
  selector: 'zonfec-result-page',
  imports: [
    PageHeader,
    PageFooter,
    TranslatePipe,
    DateTransformPipe,
    NgClass,
    RoundedValuePipe,
  ],
  templateUrl: './zonfec-result-page.component.html',
  styleUrl: './zonfec-result-page.component.scss',
})
export class ZonfecResultPageComponent implements OnInit {
  public result: number | undefined;
  public refDate: string | undefined;
  @Input() page: string;

  constructor(private customerDataService: CustomersDataService) {}

  ngOnInit(): void {
    this.customerDataService.$customerData.subscribe((data) => {
      this.result = Number(data?.result);
      this.refDate = data?.customer?.refDate;
    });
  }
}
