import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TenantService } from '../../../services/tenant.service';
import { TenantType } from '../../../enums/tenant.enum';
import { NgClass } from '@angular/common';
import { FileTypeService } from '../../../services/file-type.service';
import { FileType } from '../../../enums/file-type.enum';

const TITLES = {
  METABO: 'pdfpages.presentation.METABO',
  ISTFEC: 'pdfpages.presentation.ISTFEC',
  GUTSYS: 'pdfpages.presentation.GUTSYS',
  VLSCFA: 'pdfpages.presentation.VLSCFA',
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
  public TITLES: any = TITLES;

  constructor(
    public tenantService: TenantService,
    public fileTypeService: FileTypeService,
  ) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
    this.fileType = this.fileTypeService.fileType;
  }
}
