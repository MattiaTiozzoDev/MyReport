import { Component, Input } from '@angular/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'vlscfa-intro-1-page',
  imports: [PageFooter, PageHeader, TranslatePipe],
  templateUrl: './vlscfa-intro-1-page.html',
  styleUrl: './vlscfa-intro-1-page.scss',
})
export class VlscfaIntro1Page {
  @Input() page;
}
