import { Component, Input } from '@angular/core';
import { BarBackgroundDirective } from '../../../../directives/bar-background.directive';
import { BarPointerDirective } from '../../../../directives/bar-pointer.directive';

@Component({
  selector: 'metabolomics-bar',
  imports: [BarBackgroundDirective, BarPointerDirective],
  templateUrl: './metabolomics-bar.component.html',
  styleUrl: './metabolomics-bar.component.scss',
})
export class MetabolomicsBarComponent {
  @Input() data: any;
}
