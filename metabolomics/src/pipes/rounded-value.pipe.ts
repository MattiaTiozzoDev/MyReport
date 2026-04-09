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

  transform(value: any, reference: number | string): number | string {
    if (value == null || reference == null) return 'N.D';
    console.log(value);
    if (typeof value == 'string') value = Number(value);
    const decimals = 2;
    return value.toFixed(decimals).replace('.', ',');
  }
}
