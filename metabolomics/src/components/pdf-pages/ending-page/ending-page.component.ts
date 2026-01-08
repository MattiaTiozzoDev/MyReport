import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'metabolomics-ending-page',
  imports: [TranslatePipe],
  templateUrl: './ending-page.component.html',
  styleUrl: './ending-page.component.scss',
})
export class EndingPageComponent {}
