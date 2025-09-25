export type User = {
  id?: number;
  name?: string;
  email: string;
  address?: string;
  password?: string;
};

export type PublicUser = Omit<User, "password" | "address">;

export interface UserRecord {
  Id?: number;
  id?: number;
  Name?: string;
  name?: string;
  Email: string;
  email: string;
  Address?: string;
  address?: string;
  Password?: string;
  password?: string;
}
