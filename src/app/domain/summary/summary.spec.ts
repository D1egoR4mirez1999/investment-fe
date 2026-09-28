import { statusLabel } from './summary';

describe('statusLabel', () => {
  it('reads as En recuperación', () => {
    expect(statusLabel('en_recuperacion')).toBe('En recuperación');
  });

  it('reads as Capital recuperado', () => {
    expect(statusLabel('recuperado')).toBe('Capital recuperado');
  });

  it('reads as Pérdida del mes', () => {
    expect(statusLabel('perdida_del_mes')).toBe('Pérdida del mes');
  });
});
