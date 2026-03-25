import { Injectable } from '@angular/core';
import { CustomersDataService } from './customers-data.service';
import { map, Observable } from 'rxjs';
import { CustomerData } from '../types/customers.type';

export const VLSCFA_TABLES = [
  {
    groupId: 0,
    pageId: 0,
    sectionTitle: 'pdfpages.vlscfatable.groups.0.sectiontitle1',
    sectionTitle2: 'pdfpages.vlscfatable.groups.0.sectiontitle2',
    metaIds: '1-9',
  },
  {
    groupId: 1,
    pageId: 1,
    sectionTitle: 'pdfpages.vlscfatable.groups.1.sectiontitle1',
    sectionTitle2: 'pdfpages.vlscfatable.groups.1.sectiontitle2',
    metaIds: '10-19',
  },
];

@Injectable({
  providedIn: 'root',
})
export class VlscfaTableService {
  public readonly tables = VLSCFA_TABLES;
  public $customerData: Observable<CustomerData>;

  constructor(private customerDataService: CustomersDataService) {}

  ngOnInit(): void {
    this.$customerData = this.customerDataService.$customerData;
  }

  public getTablesFromPageId(pageId: number) {
    return this.customerDataService.$customerData.pipe(
      map((data) => {
        return this.tables
          .filter((table) => Number(table.pageId) === Number(pageId))
          .map((table) => {
            return {
              ...table,
              rows: this.getRows(table.metaIds, data?.values),
            };
          });
      }),
    );
  }

  public getRows(rows: string, data: any[]) {
    const [from, to] = rows.split('-').map(Number);
    return data.filter((el) => Number(el.id) >= from && Number(el.id) <= to);
  }
}
