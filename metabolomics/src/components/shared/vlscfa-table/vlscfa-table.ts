import { Component, Input } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { CustomerType } from '../../../enums/customerType.enum';
import { RoundedValuePipe } from '../../../pipes/rounded-value.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { VlscfabarDirective } from '../../../directives/vlscfabar.directive';

@Component({
  selector: 'vlscfa-table',
  imports: [
    NgClass,
    RoundedValuePipe,
    TranslatePipe,
    TitleCasePipe,
    VlscfabarDirective,
  ],
  templateUrl: './vlscfa-table.html',
  styleUrl: './vlscfa-table.scss',
})
export class VlscfaTable {
  public customerType = CustomerType;
  public typeText: string;

  @Input() data: any;
  @Input() type: number;
}
