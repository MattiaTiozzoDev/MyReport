import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';

const TABLE = [
  {
    id: 1,
    name: 'IL-1BETA',
    tipe: 'Pro-infiammatoria',
    source: 'Macrofagi, monociti',
  },
  {
    id: 2,
    name: 'IL-2',
    tipe: 'Pro-infiammatoria',
    source: 'Linfociti T CD4+',
  },
  {
    id: 3,
    name: 'IL-6',
    tipe: 'Pro-infiammatoria e Antinfiammatoria',
    source: 'Macrofagi, adipociti, endotelio',
  },
  {
    id: 4,
    name: 'IL-10',
    tipe: 'Pro-infiammatoria',
    source: 'Treg, macrofagi, cellule dendritiche',
  },
  {
    id: 5,
    name: 'IL-12',
    tipe: 'Pro-infiammatoria',
    source: 'Macrofagi, cellule dendritiche',
  },
  {
    id: 6,
    name: 'IL-17A',
    tipe: 'Pro-infiammatoria',
    source: 'Linfociti Th17, NK, CD8+',
  },
  {
    id: 7,
    name: 'Interferon GAMMA',
    tipe: 'Pro-infiammatoria',
    source: 'Linfociti T CD4+, CD8+, NK',
  },
  {
    id: 8,
    name: 'TNF-α',
    tipe: 'Pro-infiammatoria',
    source: 'Macrofagi, monociti, linfociti T',
  },
];

@Component({
  selector: 'intluc-table-page-2',
  imports: [PageHeader, PageFooter],
  templateUrl: './intluc-table-page-2.html',
  styleUrl: './intluc-table-page-2.scss',
})
export class IntlucTablePage2 {
  @Input() customer: any;

  @Input() page: string;

  public data: any = TABLE;
}
