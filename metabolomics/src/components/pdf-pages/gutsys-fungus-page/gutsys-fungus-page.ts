import { Component, Input } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { GutsysParasiteTableComponent } from '../../shared/gutsys-parasite-table/gutsys-parasite-table.component';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { CustomersDataService } from '../../../services/customers-data.service';

@Component({
  selector: 'gutsys-fungus-page',
  imports: [
    PageHeader,
    PageFooter,
    TranslatePipe,
    GutsysParasiteTableComponent,
  ],
  templateUrl: './gutsys-fungus-page.html',
  styleUrl: './gutsys-fungus-page.scss',
})
export class GutsysFungusPage {
  public sub: any;

  public group1: any[] = [];
  public group2: any[] = [];

  @Input() page: string;

  constructor(private customerService: CustomersDataService) {}

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      this.group1 = data.values.filter(
        (el) => Number(el.id) >= 84 && Number(el.id) <= 104,
      );
      this.group2 = data.values.filter(
        (el) => Number(el.id) >= 105 && Number(el.id) <= 124,
      );
      this.group2.push({});
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
