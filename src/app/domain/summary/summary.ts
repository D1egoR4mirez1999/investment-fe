export type MonthlyStatus = 'en_recuperacion' | 'recuperado' | 'perdida_del_mes';

export interface IMonthlySummary {
  year: number;
  month: number;
  incomeCents: number;
  expenseCents: number;
  profitCents: number;
  investorPercent: number;
  partnerPercent: number;
  investorShareCents: number;
  partnerShareCents: number;
  recoveredThisMonthCents: number;
  investorProfitThisMonthCents: number;
  recoveredCumulativeCents: number;
  remainingInvestmentCents: number;
  totalInvestmentCents: number;
  status: MonthlyStatus;
}

const STATUS_LABELS: Record<MonthlyStatus, string> = {
  en_recuperacion: 'En recuperación',
  recuperado: 'Capital recuperado',
  perdida_del_mes: 'Pérdida del mes',
};

export function statusLabel(status: MonthlyStatus | undefined): string {
  if (!status) {
    return '';
  }
  return STATUS_LABELS[status];
}
