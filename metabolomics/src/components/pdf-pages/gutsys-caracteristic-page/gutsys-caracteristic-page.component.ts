import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { CustomersDataService } from '../../../services/customers-data.service';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'gutsys-caracteristic-page',
  imports: [PageHeader, PageFooter, TranslatePipe, TitleCasePipe],
  templateUrl: './gutsys-caracteristic-page.component.html',
  styleUrl: './gutsys-caracteristic-page.component.scss',
})
export class GutsysCaracteristicPageComponent implements OnInit, OnDestroy {
  @Input() page: string;

  public ph: any;
  public cons: any;
  public color: any;
  public sub: any;

  constructor(private readonly customerService: CustomersDataService) {}

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      this.ph = data.values['80'].value;
      this.cons = data.values['81'].value;
      this.color = data.values['82'].value;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
