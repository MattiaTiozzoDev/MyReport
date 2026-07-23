import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { PresentationPageComponent } from '../../components/pdf-pages/presentation-page/presentation-page.component';
import { IndexPageComponent } from '../../components/pdf-pages/index-page/index-page.component';
import { TablePageComponent } from '../../components/pdf-pages/table-page/table-page.component';
import { CustomersDataService } from '../../services/customers-data.service';
import { forkJoin, Subscription } from 'rxjs';
import { StaticDataService } from '../../services/static-data.service';
import { ProfilePageComponent } from '../../components/pdf-pages/profile-page/profile-page.component';
import { ExplanationPageComponent } from '../../components/pdf-pages/explanation-page/explanation-page.component';
import { ImagePageComponent } from '../../components/pdf-pages/image-page/image-page.component';
import { TenantService } from '../../services/tenant.service';
import { FileTypeService } from '../../services/file-type.service';
import { FileType } from '../../enums/file-type.enum';
import { IstfecIntroductionPageComponent } from '../../components/pdf-pages/istfec-introduction-page/istfec-introduction-page.component';
import { IstfecExplanationPageComponent } from '../../components/pdf-pages/istfec-explanation-page/istfec-explanation-page.component';
import { IstfecResultPageComponent } from '../../components/pdf-pages/istfec-result-page.component/istfec-result-page.component';
import { GutsysIntroductionPageComponent } from '../../components/pdf-pages/gutsys-introduction-page/gutsys-introduction-page.component';
import { GutsysCaracteristicPageComponent } from '../../components/pdf-pages/gutsys-caracteristic-page/gutsys-caracteristic-page.component';
import { GutsysTablePageComponent } from '../../components/pdf-pages/gutsys-table-page/gutsys-table-page.component';
import { GutsysParasitePage } from '../../components/pdf-pages/gutsys-parasite-page/gutsys-parasite-page';
import { GutsysAromaPage } from '../../components/pdf-pages/gutsys-aroma-page/gutsys-aroma-page';
import { GutsysFungusPage } from '../../components/pdf-pages/gutsys-fungus-page/gutsys-fungus-page';
import { GutsysIndicationPage } from '../../components/pdf-pages/gutsys-indication-page/gutsys-indication-page';
import { NgClass, NgStyle } from '@angular/common';
import { TenantType } from '../../enums/tenant.enum';
import { REPORTS } from '../../configs/constants.utils';
import { VlscfaIntro1Page } from '../../components/pdf-pages/vlscfa-intro-1-page/vlscfa-intro-1-page';
import { VlscfaIntro2Page } from '../../components/pdf-pages/vlscfa-intro-2-page/vlscfa-intro-2-page';
import { VlscfaTablePage } from '../../components/pdf-pages/vlscfa-table-page/vlscfa-table-page';
import { VLSCFA_ELEMENTS_EXP } from '../../configs/vlscfa-explanations';
import { METABO_ELEMENTS_EXP } from '../../configs/metabolomics-explanations';
import { IggintIntroPage } from '../../components/pdf-pages/iggint-intro-page/iggint-intro-page';
import { IggintTablePage } from '../../components/pdf-pages/iggint-table-page/iggint-table-page';
import { IggintResultPage } from '../../components/pdf-pages/iggint-result-page/iggint-result-page';
import { IggintResultPage2 } from '../../components/pdf-pages/iggint-result-page-2/iggint-result-page-2';
import { UrogenIntroductionPage } from '../../components/pdf-pages/urogen-introduction-page/urogen-introduction-page';
import { UrogenTablePage } from '../../components/pdf-pages/urogen-table-page/urogen-table-page';
import { UrogenDescriptions } from '../../components/shared/urogen-descriptions/urogen-descriptions';
import { UrogenAromaPage } from '../../components/pdf-pages/urogen-aroma-page/urogen-aroma-page';
import { UrogenEndingPage } from '../../components/pdf-pages/urogen-ending-page/urogen-ending-page';
import { IntlucIntroPage } from '../../components/pdf-pages/intluc-intro-page/intluc-intro-page';
import { IntlucTablePage } from '../../components/pdf-pages/intluc-table-page/intluc-table-page';
import { IntlucTablePage2 } from '../../components/pdf-pages/intluc-table-page-2/intluc-table-page-2';
import { IntlucEndingPage1 } from '../../components/pdf-pages/intluc-ending-page-1/intluc-ending-page-1';
import { IntlucEndingPage2 } from '../../components/pdf-pages/intluc-ending-page-2/intluc-ending-page-2';
import { IntlucEndingPage3 } from '../../components/pdf-pages/intluc-ending-page-3/intluc-ending-page-3';

@Component({
  selector: 'metabolomics-pdf-container',
  imports: [
    NgClass,
    NgStyle,
    PresentationPageComponent,
    IndexPageComponent,
    TablePageComponent,
    ProfilePageComponent,
    ExplanationPageComponent,
    ImagePageComponent,
    IstfecIntroductionPageComponent,
    IstfecExplanationPageComponent,
    IstfecResultPageComponent,
    GutsysIntroductionPageComponent,
    GutsysCaracteristicPageComponent,
    GutsysTablePageComponent,
    GutsysParasitePage,
    GutsysAromaPage,
    GutsysFungusPage,
    GutsysIndicationPage,
    VlscfaIntro1Page,
    VlscfaIntro2Page,
    VlscfaTablePage,
    IggintIntroPage,
    IggintTablePage,
    IggintResultPage,
    IggintResultPage2,
    UrogenIntroductionPage,
    UrogenTablePage,
    UrogenDescriptions,
    UrogenAromaPage,
    UrogenEndingPage,
    IntlucIntroPage,
    IntlucTablePage,
    IntlucTablePage2,
    IntlucEndingPage1,
    IntlucEndingPage2,
    IntlucEndingPage3,
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
  public lang: string = '';

  get reportColor(): string {
    if (this.tenant === TenantType.HOMICA) return '#6B4C99';
    if (this.fileType === FileType.IGGINT) return REPORTS.IGGINT90.color;
    return REPORTS[this.fileType]?.color ?? '#024F84';
  }

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
      example: this.staticDataService.loadIntlucExample(),
    }).subscribe(({ example }) => {
      this.explanations =
        this.fileType === FileType.METABO
          ? METABO_ELEMENTS_EXP
          : VLSCFA_ELEMENTS_EXP;
      this.customersDataService.setData(example);
    });

    this.customersDataService.$customerData.subscribe((data) => {
      this.fileType = null;
      this.tenant = this.tenantService.tenant ?? 'valsambro';
      this.fileType = this.fileTypeService.fileType;
      this.explanations =
        this.fileType === FileType.METABO
          ? METABO_ELEMENTS_EXP
          : VLSCFA_ELEMENTS_EXP;
      this.customer = { ...data?.customer };
      this.lang = this.customer.available === 1 ? '_en' : '';
      if (
        this.explanations &&
        (this.fileType === FileType.METABO || this.fileType === FileType.VLSCFA)
      ) {
        this.setProfile(data.values);
      }
    });
  }

  private setProfile(values) {
    let hight = [];
    let low = [];
    let profile =
      this.fileType === FileType.METABO
        ? this.customersDataService.getProfileMetabolites(values)
        : this.customersDataService.getProfilevlscfa(values);
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
