export function formatMoney(cents: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cents / 100);
}

export function pesosToCents(pesos: number): number {
  return Math.round(pesos * 100);
}
