import { Component, OnInit, Input } from '@angular/core';
import { GUTSYS_TABLES } from '../../../configs/gutsys-tables';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { TranslatePipe } from '@ngx-translate/core';
import { GutsysTableComponent } from '../../shared/gutsys-table/gutsys-table.component';

@Component({
  selector: 'gutsys-table-page',
  imports: [PageHeader, PageFooter, TranslatePipe, GutsysTableComponent],
  templateUrl: './gutsys-table-page.component.html',
  styleUrl: './gutsys-table-page.component.scss',
})
export class GutsysTablePageComponent implements OnInit {
  @Input() pageId: number;
  @Input() page: string;

  public table: any;

  ngOnInit(): void {
    this.table = GUTSYS_TABLES.find((table) => table.pageId === this.pageId);
  }
}
