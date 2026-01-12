import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TenantService } from '../../../services/tenant.service';
import { TenantType } from '../../../enums/tenant.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'metabolomics-presentation-page',
  imports: [TranslatePipe, NgClass],
  templateUrl: './presentation-page.component.html',
  styleUrl: './presentation-page.component.scss',
})
export class PresentationPageComponent implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;

  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
  }
}
