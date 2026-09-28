import { formatMoney, pesosToCents } from './money';

describe('money', () => {
  it('rounds pesos to cents', () => {
    expect(pesosToCents(10.005)).toBe(1001);
  });

  it('formats cents as COP', () => {
    expect(formatMoney(10050)).toMatch(/100[,.]50/);
  });
});
