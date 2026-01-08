import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { METABOLOMICS_EXPLANATIONS } from '../../../configs/metabolomics-explanations';
import { ExplanationService } from './explanation';
import { EndingPageComponent } from '../ending-page/ending-page.component';

@Component({
  selector: 'metabolomics-explanation-page',
  imports: [PageHeader, PageFooter, TranslatePipe, EndingPageComponent],
  templateUrl: './explanation-page.component.html',
  styleUrl: './explanation-page.component.scss',
})
export class ExplanationPageComponent implements OnChanges {
  public explanations: any = [];
  public pages: any = [];

  @Input() profile: any;
  @Input() customer: any;

  constructor(private explanationService: ExplanationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile'] && changes['profile'].currentValue) {
      console.log(changes['profile'].currentValue);
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
    console.log('metabolites');
    console.log(metabolites);
    this.explanations = this.groupMetabolitesByExplanation(
      METABOLOMICS_EXPLANATIONS,
      metabolites
    ).filter((el) => el);
    console.log('explanations');
    console.log(this.explanations);
    this.pages = this.explanationService.paginate(this.explanations);
    console.log(this.pages);
  }

  private parseRange(range: string): [number, number] {
    const [min, max] = range.split('-').map(Number);
    return [min, max];
  }

  public groupMetabolitesByExplanation(
    explanations: any[],
    metabolites: any[]
  ): any[] {
    return explanations.map((exp) => {
      const [min, max] = this.parseRange(exp.metaIds);

      const matchedMetabolites = metabolites.filter(
        (m) => m.id >= min && m.id <= max
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
