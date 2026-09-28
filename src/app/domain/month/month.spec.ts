import { shiftMonth } from './month';

describe('shiftMonth', () => {
  it('moves December forward to January of the next year', () => {
    expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
  });

  it('moves January back to December of the previous year', () => {
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
  });
});
