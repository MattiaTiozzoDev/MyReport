import { Component, Input } from '@angular/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'metabolomics-image-page',
  imports: [PageFooter, PageHeader, TranslatePipe],
  templateUrl: './image-page.component.html',
  styleUrl: './image-page.component.scss',
})
export class ImagePageComponent {
  @Input() customer: any;
  @Input() title: any;
  @Input() page: string;
}
