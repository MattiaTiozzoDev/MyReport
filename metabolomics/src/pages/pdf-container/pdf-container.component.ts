import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { PresentationPageComponent } from '../../components/pdf-pages/presentation-page/presentation-page.component';
import { IndexPageComponent } from '../../components/pdf-pages/index-page/index-page.component';
import { TablePageComponent } from '../../components/pdf-pages/table-page/table-page.component';
import { CustomersDataService } from '../../services/customers-data.service';
import { forkJoin, Subscription } from 'rxjs';
import { StaticDataService } from '../../services/static-data.service';
import { ProfilePageComponent } from '../../components/pdf-pages/profile-page/profile-page.component';
import { ExplanationPageComponent } from '../../components/pdf-pages/explanation-page/explanation-page.component';
import { EndingPageComponent } from '../../components/pdf-pages/ending-page/ending-page.component';
import { ImagePageComponent } from '../../components/pdf-pages/image-page/image-page.component';
import { TenantService } from '../../services/tenant.service';
import { FileTypeService } from '../../services/file-type.service';
import { FileType } from '../../enums/file-type.enum';
import { IstfecIntroductionPageComponent } from '../../components/pdf-pages/istfec-introduction-page/istfec-introduction-page.component';
import { IstfecExplanationPageComponent } from '../../components/pdf-pages/istfec-explanation-page/istfec-explanation-page.component';
import { IstfecResultPageComponent } from '../../components/pdf-pages/istfec-result-page.component/istfec-result-page.component';

@Component({
  selector: 'metabolomics-pdf-container',
  imports: [
    PresentationPageComponent,
    IndexPageComponent,
    TablePageComponent,
    ProfilePageComponent,
    ExplanationPageComponent,
    ImagePageComponent,
    IstfecIntroductionPageComponent,
    EndingPageComponent,
    IstfecExplanationPageComponent,
    IstfecResultPageComponent,
  ],
  templateUrl: './pdf-container.component.html',
  styleUrl: './pdf-container.component.scss',
})
export class PdfContainerComponent implements OnInit {
  public customer: any;
  public explanations: any;
  public profile: any;
  public tenant: any;
  public fileType: FileType;
  public fileTypeEnum = FileType;

  constructor(
    private readonly staticDataService: StaticDataService,
    private customersDataService: CustomersDataService,
    public tenantService: TenantService,
    public fileTypeService: FileTypeService,
  ) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant ?? 'valsambro';
    this.fileType = this.fileTypeService.fileType;
    forkJoin({
      limits: this.staticDataService.loadLimit(),
      explanations: this.staticDataService.loadExplanations(),
      example: this.staticDataService.loadIstaminaExample(),
    }).subscribe(({ example, explanations }) => {
      this.explanations = explanations;
      this.customersDataService.setData(example);
    });

    this.customersDataService.$customerData.subscribe((data) => {
      this.customer = { ...data?.customer };
      if (this.explanations && this.fileType === FileType.METABO) {
        this.setMetaboProfile(data.values);
      }
    });
  }

  private setMetaboProfile(values) {
    let hight = [];
    let low = [];
    let profile = this.customersDataService.getProfileMetabolites(values);
    profile.hight.forEach((h) => {
      var explanation = this.explanations.find(
        (e) => Number(e.id) === Number(h),
      );
      if (explanation) {
        hight.push(explanation);
      }
    });
    profile.low.forEach((l) => {
      var explanation = this.explanations.find(
        (e) => Number(e.id) === Number(l),
      );
      if (explanation) {
        low.push(explanation);
      }
    });
    this.profile = { hight, low };
  }
}
