import {
  TRANSACTION_CATEGORY,
  TransactionCategory,
} from '../../../domain/transaction/transaction';

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  [TRANSACTION_CATEGORY.haircut]: 'Peinado',
  [TRANSACTION_CATEGORY.makeup]: 'Maquillaje',
  [TRANSACTION_CATEGORY.products]: 'Productos',
  [TRANSACTION_CATEGORY.rent]: 'Renta',
  [TRANSACTION_CATEGORY.utilities]: 'Servicios',
  [TRANSACTION_CATEGORY.supplies]: 'Insumos',
  [TRANSACTION_CATEGORY.other]: 'Otro',
};
