export interface User {
  name?: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}
