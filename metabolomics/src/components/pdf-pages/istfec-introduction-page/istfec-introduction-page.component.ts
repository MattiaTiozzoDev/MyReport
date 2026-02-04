import { Component } from '@angular/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'istfec-introduction-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './istfec-introduction-page.component.html',
  styleUrl: './istfec-introduction-page.component.scss',
})
export class IstfecIntroductionPageComponent {}
