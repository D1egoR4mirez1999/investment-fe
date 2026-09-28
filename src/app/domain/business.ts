export type BusinessRole = 'INVESTOR' | 'PARTNER';

export interface IBusinessMember {
  userId: string;
  name: string;
  email: string;
  role: BusinessRole;
  sharePercent: number;
}

export interface IBusinessSummaryListItem {
  id: string;
  name: string;
  role: BusinessRole;
  sharePercent: number;
  totalInvestmentCents: number;
  members: IBusinessMember[];
}
