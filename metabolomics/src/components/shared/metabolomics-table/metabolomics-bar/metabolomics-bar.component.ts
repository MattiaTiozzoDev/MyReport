import { Component, Input, OnInit } from '@angular/core';
import { BarBackgroundDirective } from '../../../../directives/bar-background.directive';
import { BarPointerDirective } from '../../../../directives/bar-pointer.directive';
import { TenantType } from '../../../../enums/tenant.enum';
import { TenantService } from '../../../../services/tenant.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'metabolomics-bar',
  imports: [BarBackgroundDirective, BarPointerDirective, NgClass],
  templateUrl: './metabolomics-bar.component.html',
  styleUrl: './metabolomics-bar.component.scss',
})
export class MetabolomicsBarComponent implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;
  @Input() data: any;

  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
  }
}
