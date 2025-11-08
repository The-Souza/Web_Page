export type Account = {
  id?: number;
  userId: number;
  userEmail?: string;
  address: string;
  accountType: string;
  year: number;
  month: string;
  consumption: number;
  days: number;
  value: number;
  paid: boolean;
};

export type AccountRecord = {
  Id: number;
  UserId: number;
  Address: string;
  Account: string;
  Year: number;
  Month: number;
  Consumption: number;
  Days: number;
  Value: number;
  Paid: boolean;
  Email?: string;
};
