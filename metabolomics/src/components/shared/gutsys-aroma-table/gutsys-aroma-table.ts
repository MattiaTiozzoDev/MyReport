import { Component, Input } from '@angular/core';

@Component({
  selector: 'gutsys-aroma-table',
  imports: [],
  templateUrl: './gutsys-aroma-table.html',
  styleUrl: './gutsys-aroma-table.scss',
})
export class GutsysAromaTable {
  @Input() title: string;
  @Input() rows: any[];

  public getSquares(number: number): any[] {
    const squares = [];
    for (let i = 0; i < number; i++) {
      squares.push('s-' + i);
    }
    return squares;
  }
}
