import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { GutsysParasiteTableComponent } from '../../shared/gutsys-parasite-table/gutsys-parasite-table.component';
import { CustomersDataService } from '../../../services/customers-data.service';

@Component({
  selector: 'gutsys-parasite-page',
  imports: [
    PageHeader,
    PageFooter,
    TranslatePipe,
    GutsysParasiteTableComponent,
  ],
  templateUrl: './gutsys-parasite-page.html',
  styleUrl: './gutsys-parasite-page.scss',
})
export class GutsysParasitePage {
  public sub: any;

  public parasites: any[] = [];

  public group1: any[] = [];
  public group2: any[] = [];

  @Input() page: string;

  constructor(private customerService: CustomersDataService) {}

  public getParasites(data: any[]): void {
    data.forEach((el) => {
      if (el.value == 'P' && this.parasites.length < 2) {
        this.parasites.push(el);
      }
    });
  }

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      this.parasites = [];
      this.getParasites(data.values);
      this.group1 = data.values.filter(
        (el) => Number(el.id) >= 33 && Number(el.id) <= 40,
      );
      this.group2 = data.values.filter(
        (el) => Number(el.id) >= 41 && Number(el.id) <= 47,
      );
      this.group2.push({});
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
