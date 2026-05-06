import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { IGGINT_TABLES } from '../../../configs/iggint-tables';

@Component({
  selector: 'iggint-table',
  imports: [TranslatePipe],
  templateUrl: './iggint-table.html',
  styleUrl: './iggint-table.scss',
})
export class IggintTable implements OnInit, OnDestroy {
  public sub: any;
  public rows: any[] = [];
  IGGINT_TABLES = IGGINT_TABLES;

  @Input() tableId: any;

  constructor(private customerService: CustomersDataService) {}

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      if (data) {
        this.rows = data.values.filter((el) => el.group == this.tableId);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
