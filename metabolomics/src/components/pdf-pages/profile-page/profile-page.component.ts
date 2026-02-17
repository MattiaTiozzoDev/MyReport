import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'metabolomics-profile-page',
  imports: [PageHeader, PageFooter, TranslatePipe, NgClass],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit, OnChanges {
  public tenant: TenantType;
  public TenantType = TenantType;
  public smallText = false;
  public hideHeaders = false;
  @Input() profile: any;
  @Input() customer: any;
  @Input() page: string;

  constructor(public tenantService: TenantService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !!changes &&
      !!changes['profile'] &&
      !!changes['profile'].currentValue
    ) {
      this.smallText =
        changes['profile'].currentValue.low.length > 17 ||
        changes['profile'].currentValue.hight.length > 17;

      this.hideHeaders =
        changes['profile'].currentValue.low.length > 33 ||
        changes['profile'].currentValue.hight.length > 33;
    }
  }

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
  }
}
