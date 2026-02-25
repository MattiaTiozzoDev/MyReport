import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { GutsysAromaTable } from '../../shared/gutsys-aroma-table/gutsys-aroma-table';
import { CustomersDataService } from '../../../services/customers-data.service';

@Component({
  selector: 'gutsys-aroma-page',
  imports: [TranslatePipe, PageFooter, PageHeader, GutsysAromaTable],
  templateUrl: './gutsys-aroma-page.html',
  styleUrl: './gutsys-aroma-page.scss',
})
export class GutsysAromaPage {
  public sub: any;

  public group1: any[] = [];
  public group2: any[] = [];
  public group3: any[] = [];

  @Input() page: string;

  constructor(private customerService: CustomersDataService) {}

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      this.group1 = data.values.filter(
        (el) => Number(el.id) >= 48 && Number(el.id) <= 55,
      );
      this.group2 = data.values.filter(
        (el) => Number(el.id) >= 56 && Number(el.id) <= 71,
      );
      this.group3 = data.values.filter(
        (el) => Number(el.id) >= 72 && Number(el.id) <= 79,
      );
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
