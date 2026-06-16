import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TenantService } from '../../../services/tenant.service';
import { TenantType } from '../../../enums/tenant.enum';
import { REPORTS } from '../../../configs/constants.utils';
import { FileTypeService } from '../../../services/file-type.service';
import { FileType } from '../../../enums/file-type.enum';
import { CustomersDataService } from '../../../services/customers-data.service';

@Component({
  selector: 'presentation-page',
  imports: [TranslatePipe],
  templateUrl: './presentation-page.component.html',
  styleUrl: './presentation-page.component.scss',
})
export class PresentationPageComponent implements OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;
  public fileType: FileType;
  public TITLE: any;
  public population: any;
  public name: string;
  SUBTITLE: string;

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
        this.name = data.customer.name;
        if (this.fileType === FileType.IGGINT) {
          this.TITLE =
            data.customer.type == 1
              ? REPORTS.IGGINT90.title
              : REPORTS.IGGINT180.title;
          this.SUBTITLE =
            data.customer.type == 1
              ? REPORTS.IGGINT90.subtitle
              : REPORTS.IGGINT180.subtitle;
        } else {
          this.TITLE = REPORTS[this.fileType].title;
          this.SUBTITLE = REPORTS[this.fileType].subtitle;
        }
      }
    });
  }
}
