export interface User {
  id?: number;
  name?: string;
  email: string;
  address?: string | null;
  password?: string;
}

export type PublicUser = Omit<User, "password" | "address">;

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: PublicUser;
  token?: string;
}

export interface CheckUserResponse {
  success: boolean;
  exists: boolean;
  message?: string;
}
