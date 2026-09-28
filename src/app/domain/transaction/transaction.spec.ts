import {
  buildCreateTransactionRequest,
  categoriesForType,
  isCategoryAllowedForType,
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from './transaction';

describe('transaction', () => {
  it('allows haircut, makeup, or other for an income', () => {
    expect(categoriesForType(TRANSACTION_TYPE.income)).toEqual([
      TRANSACTION_CATEGORY.haircut,
      TRANSACTION_CATEGORY.makeup,
      TRANSACTION_CATEGORY.other,
    ]);
  });

  it('does not allow haircut for an expense', () => {
    expect(
      isCategoryAllowedForType(TRANSACTION_TYPE.expense, TRANSACTION_CATEGORY.haircut),
    ).toBe(false);
  });

  it('does not send a $0 movement', () => {
    expect(
      buildCreateTransactionRequest({
        type: TRANSACTION_TYPE.income,
        category: TRANSACTION_CATEGORY.haircut,
        amountPesos: 0,
        occurredOn: '2026-03-15',
        note: '',
      }),
    ).toBeNull();
  });

  it('sends the payload in cents', () => {
    expect(
      buildCreateTransactionRequest({
        type: TRANSACTION_TYPE.income,
        category: TRANSACTION_CATEGORY.haircut,
        amountPesos: 10.5,
        occurredOn: '2026-03-15',
        note: '',
      }),
    ).toEqual({
      type: TRANSACTION_TYPE.income,
      category: TRANSACTION_CATEGORY.haircut,
      amountCents: 1050,
      occurredOn: '2026-03-15',
    });
  });

  it('does not send an empty note', () => {
    const request = buildCreateTransactionRequest({
      type: TRANSACTION_TYPE.expense,
      category: TRANSACTION_CATEGORY.rent,
      amountPesos: 100,
      occurredOn: '2026-03-15',
      note: '   ',
    });

    expect(request).toEqual({
      type: TRANSACTION_TYPE.expense,
      category: TRANSACTION_CATEGORY.rent,
      amountCents: 10000,
      occurredOn: '2026-03-15',
    });
    expect(request).not.toHaveProperty('note');
  });
});
