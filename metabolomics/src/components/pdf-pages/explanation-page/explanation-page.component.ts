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
import { METABOLOMICS_EXPLANATIONS } from '../../../configs/metabolomics-explanations';
import { ExplanationService } from '../../../services/explanation.service';
import { TenantType } from '../../../enums/tenant.enum';
import { TenantService } from '../../../services/tenant.service';
import { FileTypeService } from '../../../services/file-type.service';
import { FileType } from '../../../enums/file-type.enum';
import { VLSCFA_EXPLANATIONS } from '../../../configs/vlscfa-explanations';
import { AMMINO_EXPLANATIONS } from '../../../configs/ammino-explanations';

@Component({
  selector: 'metabolomics-explanation-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './explanation-page.component.html',
  styleUrl: './explanation-page.component.scss',
})
export class ExplanationPageComponent implements OnChanges, OnInit {
  public tenant: TenantType;
  public TenantType = TenantType;
  public explanations: any = [];
  public pages: any = [];
  public fileType: FileType;
  public FileTypeEnum = FileType;

  @Input() page: string;
  @Input() profile: any;
  @Input() customer: any;
  @Input() basicIndex: number;

  constructor(
    private explanationService: ExplanationService,
    public tenantService: TenantService,
    public fileTypeService: FileTypeService,
  ) {}

  ngOnInit(): void {
    this.fileType = this.fileTypeService.fileType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tenant = this.tenantService.tenant;
    if (changes['profile'] && changes['profile'].currentValue) {
      this.fileType = this.fileTypeService.fileType;
      this.setExplanations(changes['profile'].currentValue);
    }
  }

  private setExplanations(profile) {
    let metabolites = [];
    profile?.hight?.forEach((element) => {
      metabolites.push({
        id: element.id,
        name: element.name,
        base: element.base,
        critic: element.hight,
      });
    });
    profile?.low?.forEach((element) => {
      metabolites.push({
        id: element.id,
        name: element.name,
        base: element.base,
        critic: element.low,
      });
    });
    metabolites.sort((m1, m2) => m1.id - m2.id);
    let explanationGroups: any = VLSCFA_EXPLANATIONS;
    switch (this.fileType) {
      case FileType.METABO:
        explanationGroups = METABOLOMICS_EXPLANATIONS;
        break;
      case FileType.AMMINO:
        explanationGroups = AMMINO_EXPLANATIONS;
        break;
    }
    this.explanations = this.groupMetabolitesByExplanation(
      explanationGroups,
      metabolites,
    ).filter((el) => el);
    this.pages = this.explanationService.paginate(this.explanations);
  }

  private parseRange(range: string): [number, number] {
    const [min, max] = range.split('-').map(Number);
    return [min, max];
  }

  public groupMetabolitesByExplanation(
    explanations: any[],
    metabolites: any[],
  ): any[] {
    return explanations.map((exp) => {
      const [min, max] = this.parseRange(exp.metaIds);

      const matchedMetabolites = metabolites.filter(
        (m) => m.id >= min && m.id <= max,
      );

      if (matchedMetabolites.length === 0) {
        return null;
      }

      return {
        ...exp,
        metabolites: matchedMetabolites,
      };
    });
  }
}
