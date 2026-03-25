import { Component, Input } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { VlscfaTableService } from '../../../services/vlscfa-table.service';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { VlscfaTable } from '../../shared/vlscfa-table/vlscfa-table';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';

@Component({
  selector: 'vlscfa-table-page',
  imports: [
    PageFooter,
    PageHeader,
    VlscfaTable,
    TranslatePipe,
    DateTransformPipe,
  ],
  templateUrl: './vlscfa-table-page.html',
  styleUrl: './vlscfa-table-page.scss',
})
export class VlscfaTablePage {
  public tables: any;
  public tablesSubscription: Subscription;

  @Input() pageId: number;

  @Input() sectionTitle: string;

  @Input() customer: any;

  @Input() page: string;

  constructor(private vlscfaTableService: VlscfaTableService) {}

  ngOnInit(): void {
    this.tablesSubscription = this.vlscfaTableService
      .getTablesFromPageId(this.pageId)
      .pipe(
        tap((tables) => {
          this.tables = tables;
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.tablesSubscription.unsubscribe();
  }
}
