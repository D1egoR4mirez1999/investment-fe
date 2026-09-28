import { Pipe, PipeTransform } from '@angular/core';
import { TransactionCategory } from '../../../../domain/transaction/transaction';
import { CATEGORY_LABELS } from '../../constants/business-detail.constants';

@Pipe({
  name: 'categoryLabel',
})
export class CategoryLabel implements PipeTransform {
  transform(category: TransactionCategory | string): string {
    return CATEGORY_LABELS[category as TransactionCategory] ?? category;
  }
}
