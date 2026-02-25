import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gutsys-table',
  imports: [NgClass, TranslatePipe],
  templateUrl: './gutsys-table.component.html',
  styleUrl: './gutsys-table.component.scss',
})
export class GutsysTableComponent implements OnInit, OnDestroy, OnChanges {
  public sub: any;
  public values: any;
  public rows: any[] = [];

  @Input() elements: string;
  @Input() title: string;
  @Input() tableId: number;

  constructor(private customerService: CustomersDataService) {}

  public getRows(rows: string) {
    const [from, to] = rows.split('-').map(Number);
    return this.values?.filter(
      (el) => Number(el.id) >= from && Number(el.id) <= to,
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['elements'] && changes['elements'].currentValue) {
    //   this.rows = this.getRows(changes['elements'].currentValue);
    // }
  }

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      this.values = data.values;
      this.rows = this.getRows(this.elements);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
