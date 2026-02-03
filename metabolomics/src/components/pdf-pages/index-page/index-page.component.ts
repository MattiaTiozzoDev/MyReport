import { Component, Input, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { NgClass, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'metabolomics-index-page',
  imports: [PageHeader, PageFooter, TranslatePipe, NgClass, UpperCasePipe],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss',
})
export class IndexPageComponent implements OnInit {
  @Input() customer: any;
  public tenant: TenantType;
  public TenantType = TenantType;
  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
  }
}
