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
import { CustomersDataService } from '../../../services/customers-data.service';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { UpperCasePipe } from '@angular/common';
import { FileTypeService } from '../../../services/file-type.service';
import { FileType } from '../../../enums/file-type.enum';
import {
  METABO_INDEXES_ARRAY,
  ISTAMINA_INDEXES_ARRAY,
  GUTSYS_INDEXES_ARRAY_3,
  GUTSYS_INDEXES_ARRAY_2,
  GUTSYS_INDEXES_ARRAY_1,
  VLSCFA_INDEXES_ARRAY,
  IGGINT_INDEXES_ARRAY_180,
  IGGINT_INDEXES_ARRAY_90,
  GUTSYS_INDEXES_ARRAY_4,
  UROGEN_INDEXES_ARRAY,
  INTLUC_INDEXES_ARRAY,
} from '../../../configs/indexes.arrays';

@Component({
  selector: 'index-page',
  imports: [PageHeader, PageFooter, TranslatePipe, UpperCasePipe],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss',
})
export class IndexPageComponent implements OnInit, OnChanges {
  @Input() customer: any;
  @Input() type: number;
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
      case FileType.VLSCFA:
        this.indexesArray = VLSCFA_INDEXES_ARRAY;
        break;
      case FileType.UROGEN:
        this.indexesArray = UROGEN_INDEXES_ARRAY;
        break;
      case FileType.INTLUC:
        this.indexesArray = INTLUC_INDEXES_ARRAY;
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['type'] &&
      changes['type'].currentValue &&
      this.fileTypeService.fileType === FileType.GUTSYS
    ) {
      this.indexesArray = this.getGutsysIndexesArray(
        changes['type'].currentValue,
      );
    }

    if (
      changes['type'] &&
      changes['type'].currentValue &&
      this.fileTypeService.fileType === FileType.IGGINT
    ) {
      this.indexesArray = this.getIggintIndexesArray(
        changes['type'].currentValue,
      );
    }
  }

  public getGutsysIndexesArray(type) {
    switch (type) {
      case 1:
        return GUTSYS_INDEXES_ARRAY_1;
      case 2:
        return GUTSYS_INDEXES_ARRAY_2;
      case 3:
        return GUTSYS_INDEXES_ARRAY_3;
      case 4:
        return GUTSYS_INDEXES_ARRAY_4;
      default:
        return [];
    }
  }

  public getIggintIndexesArray(type) {
    switch (type) {
      case 1:
        return IGGINT_INDEXES_ARRAY_90;
      case 2:
        return IGGINT_INDEXES_ARRAY_180;
      default:
        return [];
    }
  }
}
