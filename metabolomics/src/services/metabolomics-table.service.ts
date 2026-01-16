import { Injectable, OnInit } from '@angular/core';
import { METABOLOMICS_TABLES } from '../configs/metabolomics-tables';
import { CustomersDataService } from './customers-data.service';
import { filter, map, Observable } from 'rxjs';
import { CustomerData, MappedValue } from '../types/customers.type';

@Injectable({
  providedIn: 'root',
})
export class MetabolomicsTableService implements OnInit {
  public readonly tables = METABOLOMICS_TABLES;
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
              rows: this.getRows(table.metaIds, data.values),
            };
          });
      })
    );
  }

  public getRows(rows: string, data: MappedValue[]) {
    const [from, to] = rows.split('-').map(Number);
    return data.filter((el) => Number(el.id) >= from && Number(el.id) <= to);
  }
}
