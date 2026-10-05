import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { Customer } from '../../../types/customers.type';
import { Subscription } from 'rxjs';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'metabolomics-page-header',
  imports: [TranslatePipe, DateTransformPipe, TitleCasePipe],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeader implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;
  public name: string;

  public customer: Customer;

  constructor(
    public tenantService: TenantService,
    private customerService: CustomersDataService,
  ) {}

  ngOnInit(): void {
    this.customerService.$customerData.subscribe((data) => {
      this.tenant = this.tenantService.tenant;
      this.customer = data.customer;
      this.name = data.customer?.name ?? '';
    });
  }
}
