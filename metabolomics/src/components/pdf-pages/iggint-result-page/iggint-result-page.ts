import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomersDataService } from '../../../services/customers-data.service';

@Component({
  selector: 'iggint-result-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './iggint-result-page.html',
  styleUrl: './iggint-result-page.scss',
})
export class IggintResultPage implements OnInit, OnDestroy {
  public sub: any;
  public high: any[] = [];
  public medium: any[] = [];
  public low: any[] = [];

  @Input() page: string;

  constructor(public customerService: CustomersDataService) {}

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      this.low = data.values
        .filter((el) => el.value >= 1 && el.value <= 10)
        .map((el) => el.name);
      this.medium = data.values
        .filter((el) => el.value > 10 && el.value <= 30)
        .map((el) => el.name);
      this.high = data.values
        .filter((el) => el.value > 30)
        .map((el) => el.name);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
