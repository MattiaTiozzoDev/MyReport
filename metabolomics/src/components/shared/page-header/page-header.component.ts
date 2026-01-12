import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { Customer } from '../../../types/customers.type';
import { Subscription } from 'rxjs';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'metabolomics-page-header',
  imports: [TranslatePipe, DateTransformPipe, NgClass],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeader implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;

  @Input() customer: Customer;

  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
  }
}
