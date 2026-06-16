import { Component, Input, OnInit } from '@angular/core';
import { UROGEN_NAMES, UROGEN_DESC } from '../../../configs/urogen-names';

@Component({
  selector: 'urogen-descriptions',
  imports: [],
  templateUrl: './urogen-descriptions.html',
  styleUrl: './urogen-descriptions.scss',
})
export class UrogenDescriptions implements OnInit {
  public values: any;
  public rows: any[] = [];

  @Input() elements: string;
  @Input() title: string;

  constructor() {}

  public getRows(rows: string) {
    const [from, to] = rows.split('-').map(Number);
    return Object.keys(UROGEN_NAMES)
      .filter((el) => Number(el) >= from && Number(el) <= to)
      .map((el) => ({ id: el, name: UROGEN_NAMES[el], desc: UROGEN_DESC[el] }));
  }

  ngOnInit(): void {
    this.rows = this.getRows(this.elements);
  }
}
