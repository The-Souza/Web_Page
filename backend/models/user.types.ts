export type User = {
  id: number;
  name?: string | null;
  email: string;
  address?: string | null;
  password?: string;
};

export type PublicUser = Omit<User, "address">;

// Como o Supabase realmente retorna
export type UserRecord = {
  id: number;
  name: string | null;
  email: string;
  address: string | null;
  password?: string; // se você realmente armazena isso (geralmente não com Supabase Auth)
};
