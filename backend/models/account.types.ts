// Modelo usado internamente na aplicação
export type Account = {
  id: number;
  userId: number;
  userEmail?: string | null;
  address: string;
  accountType: string;
  year: number;
  month: string; // "02/2024"
  consumption: number;
  days: number;
  value: number;
  paid: boolean;
};

// O que o banco retorna REALMENTE (Supabase)
export type SupabaseAccountRow = {
  id: number;
  userid: number;
  address: string;
  account: string;
  year: number;
  month: number;
  consumption: number;
  days: number;
  value: number;
  paid: boolean;
  users?: {
    email: string | null;
  } | null;
};

export type NewAccount = Omit<Account, "id">;

// Conversão direta do Supabase → modelo do sistema
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
  Email?: string | null;
};
