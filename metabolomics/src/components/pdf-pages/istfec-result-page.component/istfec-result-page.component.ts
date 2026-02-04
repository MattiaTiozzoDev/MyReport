import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { CustomersDataService } from '../../../services/customers-data.service';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'istfec-result-page',
  imports: [PageHeader, PageFooter, TranslatePipe, DateTransformPipe, NgClass],
  templateUrl: './istfec-result-page.component.html',
  styleUrl: './istfec-result-page.component.scss',
})
export class IstfecResultPageComponent implements OnInit {
  public result: number | undefined;
  public refDate: string | undefined;

  constructor(private customerDataService: CustomersDataService) {}

  ngOnInit(): void {
    this.customerDataService.$customerData.subscribe((data) => {
      this.result = Number(data?.result);
      this.refDate = data?.customer?.refDate;
    });
  }
}
