export type MonthSummary = {
  totalValue: number;
  paidValue: number;
  unpaidValue: number;
  paidPercentage: number;
  diffFromLastMonth: number;
};

export type Account = {
  id: number;
  userId: number;
  userEmail: string;
  address: string;
  accountType: string;
  year: number;
  month: string;
  consumption: number;
  days: number;
  value: number;
  paid: boolean;
};

export type AccountTypeSummary = {
  type: string;
  totalValue: number;
  paidValue: number;
  unpaidValue: number;
};
