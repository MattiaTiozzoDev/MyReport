import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gutsys-parasite-table',
  imports: [TranslatePipe, NgClass],
  templateUrl: './gutsys-parasite-table.component.html',
  styleUrl: './gutsys-parasite-table.component.scss',
})
export class GutsysParasiteTableComponent {
  @Input() rows: any[];
  @Input() defaultIdStart: number = 0;
}
