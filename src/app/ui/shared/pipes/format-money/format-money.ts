import { Pipe, PipeTransform } from '@angular/core';
import { formatMoney } from '../../../../domain/money/money';

@Pipe({
  name: 'formatMoney',
})
export class FormatMoney implements PipeTransform {
  transform(cents: number): string {
    return formatMoney(cents);
  }
}
