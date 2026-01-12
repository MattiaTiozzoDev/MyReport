import { Component, OnInit } from '@angular/core';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'metabolomics-page-footer',
  imports: [NgClass],
  templateUrl: './page-footer.html',
  styleUrl: './page-footer.scss',
})
export class PageFooter implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;

  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
  }
}
