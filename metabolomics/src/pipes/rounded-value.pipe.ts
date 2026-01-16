import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundedValue',
})
export class RoundedValuePipe implements PipeTransform {
  private getDecimals(value: number | string): number {
    const str = value.toString();
    const idx = str.indexOf('.');
    return idx >= 0 ? str.length - idx - 1 : 0;
  }

  transform(value: number, reference: number | string): number | string {
    if (value == null || reference == null) return 'N.D';
    const decimals = 2;
    return Number(Number(value).toFixed(decimals));
  }
}
