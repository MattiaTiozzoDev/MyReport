import { Component, Input, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { NgClass, UpperCasePipe } from '@angular/common';
import { FileTypeService } from '../../../services/file-type.service';
import { FileType } from '../../../enums/file-type.enum';
import {
  METABO_INDEXES_ARRAY,
  ISTAMINA_INDEXES_ARRAY,
} from '../../../configs/indexes.arrays';

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
  public fileType: FileType;
  public indexesArray: any[] = [];

  constructor(
    public tenantService: TenantService,
    public fileTypeService: FileTypeService,
  ) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
    this.fileType = this.fileTypeService.fileType;
    switch (this.fileType) {
      case FileType.METABO:
        this.indexesArray = METABO_INDEXES_ARRAY;
        break;
      case FileType.ISTFEC:
        this.indexesArray = ISTAMINA_INDEXES_ARRAY;
        break;
    }
  }
}
