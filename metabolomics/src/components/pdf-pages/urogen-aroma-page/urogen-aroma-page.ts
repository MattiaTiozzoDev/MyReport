import { Component, Input } from '@angular/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { GutsysAromaTable } from '../../shared/gutsys-aroma-table/gutsys-aroma-table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'urogen-aroma-page',
  imports: [PageFooter, PageHeader, GutsysAromaTable, TranslatePipe],
  templateUrl: './urogen-aroma-page.html',
  styleUrl: './urogen-aroma-page.scss',
})
export class UrogenAromaPage {
  public sub: any;

  public group1: any[] = [];
  public group2: any[] = [];
  public group3: any[] = [];
  public group4: any[] = [];
  public group5: any[] = [];
  public addedText: string = null;

  @Input() page: string;

  constructor(private customerService: CustomersDataService) {}

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      this.group1 = data.values.filter(
        (el) => Number(el.id) >= 48 && Number(el.id) <= 55,
      );
      this.group2 = data.values.filter(
        (el) => Number(el.id) >= 56 && Number(el.id) <= 64,
      );
      this.group3 = data.values.filter(
        (el) => Number(el.id) >= 65 && Number(el.id) <= 80,
      );
      this.group4 = data.values.filter(
        (el) => Number(el.id) >= 81 && Number(el.id) <= 88,
      );
      this.group5 = data.values.filter(
        (el) => Number(el.id) >= 89 && Number(el.id) <= 96,
      );
      this.addedText = data.values.find((el) => el.id === '97')?.value ?? null;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
