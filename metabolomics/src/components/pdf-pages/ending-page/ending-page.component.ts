import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TenantType } from '../../../enums/tenant.enum';
import { NgClass } from '@angular/common';
import { TenantService } from '../../../services/tenant.service';

@Component({
  selector: 'metabolomics-ending-page',
  imports: [TranslatePipe, NgClass],
  templateUrl: './ending-page.component.html',
  styleUrl: './ending-page.component.scss',
})
export class EndingPageComponent implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;

  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
  }
}
