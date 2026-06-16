import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomersDataService } from '../../../services/customers-data.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'urogen-table',
  imports: [NgClass],
  templateUrl: './urogen-table.html',
  styleUrl: './urogen-table.scss',
})
export class UrogenTable implements OnInit, OnDestroy {
  public sub: any;
  public values: any;
  public rows: any[] = [];

  @Input() elements: string;
  @Input() title: string;
  @Input() tableId: number;

  constructor(private customerService: CustomersDataService) {}

  getLevel(value: string): string {
    if (!value) return '';
    return value.split('-')[0];
  }

  getSuffix(value: string): string | null {
    if (!value) return null;
    const parts = value.split('-');
    return parts.length > 1 ? parts[1] : null;
  }

  public getRows(rows: string) {
    const [from, to] = rows.split('-').map(Number);
    return this.values?.filter(
      (el) => Number(el.id) >= from && Number(el.id) <= to,
    );
  }

  ngOnInit(): void {
    this.sub = this.customerService.$customerData.subscribe((data) => {
      if (data) {
        this.values = data.values;
        this.rows = this.getRows(this.elements);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
