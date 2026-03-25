import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { PageFooter } from '../../shared/page-footer/page-footer';

@Component({
  selector: 'vlscfa-intro-2-page',
  imports: [PageFooter, PageHeader, TranslatePipe],
  templateUrl: './vlscfa-intro-2-page.html',
  styleUrl: './vlscfa-intro-2-page.scss',
})
export class VlscfaIntro2Page {
  @Input() page;
}
