import { Component, Input } from '@angular/core';
import { UROGEN_TABLES } from '../../../configs/urogen-tables';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';

import { UrogenTable } from '../../shared/urogen-table/urogen-table';

@Component({
  selector: 'urogen-table-page',
  imports: [PageHeader, PageFooter, UrogenTable],
  templateUrl: './urogen-table-page.html',
  styleUrl: './urogen-table-page.scss',
})
export class UrogenTablePage {
  @Input() pageId: number;
  @Input() page: string;

  public table: any;

  ngOnInit(): void {
    this.table = UROGEN_TABLES.find((table) => table.pageId === this.pageId);
  }
}
