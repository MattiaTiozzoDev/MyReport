import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { MetabolomicsTableComponent } from '../../shared/metabolomics-table/metabolomics-table.component';
import { MetabolomicsTableService } from '../../../services/metabolomics-table.service';
import { Subscription, tap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';
import { TenantService } from '../../../services/tenant.service';
import { TenantType } from '../../../enums/tenant.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'metabolomics-table-page',
  imports: [
    PageHeader,
    PageFooter,
    MetabolomicsTableComponent,
    TranslatePipe,
    DateTransformPipe,
    NgClass,
  ],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.scss',
})
export class TablePageComponent implements OnInit, OnDestroy {
  public tables: any;
  public tablesSubscription: Subscription;
  public tenant: TenantType;
  public TenantType = TenantType;

  @Input() pageId: number;

  @Input() sectionTitle: string;

  @Input() customer: any;

  constructor(
    private metabolomicsTableService: MetabolomicsTableService,
    public tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.tenant = this.tenantService.tenant;
    this.tablesSubscription = this.metabolomicsTableService
      .getTablesFromPageId(this.pageId)
      .pipe(
        tap((tables) => {
          this.tables = tables;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.tablesSubscription.unsubscribe();
  }
}
