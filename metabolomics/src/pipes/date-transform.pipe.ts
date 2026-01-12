import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTransform',
})
export class DateTransformPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const parts = value.split('_');
    if (parts.length !== 3) return value;

    const [day, month, year] = parts;

    return `${day}/${month}/${year}`;
  }
}
