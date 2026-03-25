import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const HEADER_HEIGHT = 110;
const FOOTER_HEIGHT = 40;
const GENERAL_BASE_HEIGHT = 80;
const METABOLITE_BASE_HEIGHT = 73;

@Injectable({ providedIn: 'root' })
export class ExplanationService {
  constructor(private translateService: TranslateService) {}

  public paginate(explanations) {
    let pages = [[]];
    let heightCounter = 0;
    let pageIndex = 0;
    this.flatItems(explanations).forEach((el) => {
      heightCounter += el.height;
      if (heightCounter > 690) {
        heightCounter = el.height;
        pages.push([]);
        pageIndex++;
      }
      pages[pageIndex].push(el);
    });
    return pages;
  }

  private flatItems(explanations) {
    let flatItems = [];
    explanations?.forEach((element) => {
      if (element.general) {
        flatItems.push({
          ...element,
          type: 'general',
          height: this.getGeneralHeight(element.general),
        });
      }
      element?.metabolites?.forEach((el) => {
        flatItems.push({
          ...el,
          type: 'metabolite',
          height: this.getMetaboliteHeight(el),
        });
      });
    });
    return flatItems;
  }

  private getMetaboliteHeight(content) {
    let baseLength = this.translateService.instant(content.base ?? '').length;
    let criticLength = 11;
    if (content.critic) {
      criticLength = this.translateService.instant(content.critic ?? '').length;
    }
    return (
      Math.ceil(criticLength / 120) * 10 +
      Math.ceil(baseLength / 140) * 10 +
      METABOLITE_BASE_HEIGHT
    );
  }

  private getGeneralHeight(string) {
    let length = this.translateService.instant(string).length;
    return Math.ceil(length / 140) * 10 + GENERAL_BASE_HEIGHT;
  }
}
