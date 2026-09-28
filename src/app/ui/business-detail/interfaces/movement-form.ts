import {
  TransactionCategory,
  TransactionType,
} from '../../../domain/transaction/transaction';

export interface IMovementForm {
  type: TransactionType;
  category: TransactionCategory;
  amountPesos: number;
  occurredOn: string;
  note: string;
}
