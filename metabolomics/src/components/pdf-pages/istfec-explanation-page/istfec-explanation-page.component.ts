import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';

@Component({
  selector: 'istfec-explanation-page',
  imports: [PageHeader, PageFooter, TranslatePipe],
  templateUrl: './istfec-explanation-page.component.html',
  styleUrl: './istfec-explanation-page.component.scss',
})
export class IstfecExplanationPageComponent {}
