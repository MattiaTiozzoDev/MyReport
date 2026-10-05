import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { CustomersDataService } from '../../../services/customers-data.service';
import { getCortisStatus, CortisStatus } from '../../../configs/cortis-limits';

type CortisRow = {
  name: string;
  status: CortisStatus | null;
};

@Component({
  selector: 'cortis-result-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './cortis-result-page.component.html',
  styleUrl: './cortis-result-page.component.scss',
})
export class CortisResultPageComponent implements OnInit {
  public rows: CortisRow[] = [];
  @Input() page: string;

  constructor(private customerDataService: CustomersDataService) {}

  ngOnInit(): void {
    this.customerDataService.$customerData.subscribe((data) => {
      this.rows = (data?.values ?? []).map((el) => ({
        name: el.name,
        status: getCortisStatus(el.id, el.value),
      }));
    });
  }
}
