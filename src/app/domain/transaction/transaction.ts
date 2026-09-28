import { pesosToCents } from '../money/money';

export const TRANSACTION_TYPE = {
  income: 'INCOME',
  expense: 'EXPENSE',
} as const;

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export const TRANSACTION_CATEGORY = {
  haircut: 'HAIRCUT',
  makeup: 'MAKEUP',
  products: 'PRODUCTS',
  rent: 'RENT',
  utilities: 'UTILITIES',
  supplies: 'SUPPLIES',
  other: 'OTHER',
} as const;

export type TransactionCategory =
  (typeof TRANSACTION_CATEGORY)[keyof typeof TRANSACTION_CATEGORY];

export const INCOME_CATEGORIES: readonly TransactionCategory[] = [
  TRANSACTION_CATEGORY.haircut,
  TRANSACTION_CATEGORY.makeup,
  TRANSACTION_CATEGORY.other,
];

export const EXPENSE_CATEGORIES: readonly TransactionCategory[] = [
  TRANSACTION_CATEGORY.products,
  TRANSACTION_CATEGORY.rent,
  TRANSACTION_CATEGORY.utilities,
  TRANSACTION_CATEGORY.supplies,
  TRANSACTION_CATEGORY.other,
];

export interface ITransaction {
  id: string;
  businessId: string;
  createdById: string;
  type: TransactionType;
  category: TransactionCategory;
  amountCents: number;
  occurredOn: string;
  note: string | null;
  createdAt: string;
}

export interface ICreateTransactionRequest {
  type: TransactionType;
  category: TransactionCategory;
  amountCents: number;
  occurredOn: string;
  note?: string;
}

export interface IMovementDraft {
  type: TransactionType;
  category: TransactionCategory;
  amountPesos: number;
  occurredOn: string;
  note: string;
}

export function categoriesForType(type: TransactionType): readonly TransactionCategory[] {
  return type === TRANSACTION_TYPE.income ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function isCategoryAllowedForType(
  type: TransactionType,
  category: TransactionCategory,
): boolean {
  return categoriesForType(type).includes(category);
}

export function buildCreateTransactionRequest(
  draft: IMovementDraft,
): ICreateTransactionRequest | null {
  const amountCents = pesosToCents(draft.amountPesos);
  if (amountCents <= 0) {
    return null;
  }

  if (!isCategoryAllowedForType(draft.type, draft.category)) {
    return null;
  }

  const request: ICreateTransactionRequest = {
    type: draft.type,
    category: draft.category,
    amountCents,
    occurredOn: draft.occurredOn,
  };

  const note = draft.note.trim();
  if (note) {
    request.note = note;
  }

  return request;
}
