import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TenantService } from '../../../services/tenant.service';
import { TenantType } from '../../../enums/tenant.enum';
import { NgClass } from '@angular/common';
import { FileTypeService } from '../../../services/file-type.service';
import { FileType } from '../../../enums/file-type.enum';
import { CustomersDataService } from '../../../services/customers-data.service';

const TITLES = {
  METABO: 'pdfpages.presentation.METABO',
  ISTFEC: 'pdfpages.presentation.ISTFEC',
  GUTSYS: 'pdfpages.presentation.GUTSYS',
  VLSCFA: 'pdfpages.presentation.VLSCFA',
  IGGINT90: 'pdfpages.presentation.IGGINT90',
  IGGINT180: 'pdfpages.presentation.IGGINT180',
};

@Component({
  selector: 'presentation-page',
  imports: [TranslatePipe, NgClass],
  templateUrl: './presentation-page.component.html',
  styleUrl: './presentation-page.component.scss',
})
export class PresentationPageComponent implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;
  public fileType: FileType;
  public TITLE: any;
  public population: any;

  constructor(
    public tenantService: TenantService,
    public fileTypeService: FileTypeService,
    public customersDataService: CustomersDataService,
  ) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
    this.fileType = this.fileTypeService.fileType;
    this.customersDataService.$customerData.subscribe((data) => {
      if (data) {
        if (this.fileType === FileType.IGGINT) {
          this.TITLE =
            data.customer.type == 1 ? TITLES.IGGINT90 : TITLES.IGGINT180;
        } else {
          this.TITLE = TITLES[this.fileType];
        }
      }
    });
  }
}
