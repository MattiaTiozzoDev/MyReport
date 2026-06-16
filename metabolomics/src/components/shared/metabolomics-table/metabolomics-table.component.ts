import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MetabolomicsBarComponent } from './metabolomics-bar/metabolomics-bar.component';
import { CustomerType } from '../../../enums/customerType.enum';
import { TranslatePipe } from '@ngx-translate/core';
import { RoundedValuePipe } from '../../../pipes/rounded-value.pipe';

@Component({
  selector: 'metabolomics-table',
  imports: [NgClass, MetabolomicsBarComponent, TranslatePipe, RoundedValuePipe],
  templateUrl: './metabolomics-table.component.html',
  styleUrl: './metabolomics-table.component.scss',
})
export class MetabolomicsTableComponent implements OnChanges, OnInit {
  public customerType = CustomerType;
  public typeText: string;

  @Input() data: any;
  @Input() type: number;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && changes['type'].currentValue) {
      this.setType(changes['type'].currentValue);
    }
  }

  private setType(type) {
    switch (type) {
      case this.customerType.CHILD:
        this.typeText = 'pdfpages.metabolomicstable.child';
        break;
      case this.customerType.MAN:
        this.typeText = 'pdfpages.metabolomicstable.man';
        break;
      case this.customerType.WOMAN:
        this.typeText = 'pdfpages.metabolomicstable.woman';
        break;
    }
  }
}
