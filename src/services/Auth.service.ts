import { apiClient } from "./ApiClient.service";
import type {
  LoginResponse,
  CheckUserResponse,
  User,
} from "@/types/auth.types";

/**
 * Registra um novo usuário.
 *
 * - Envia os dados de cadastro para o backend
 * - Usa apiClient para padronizar erros e respostas
 * - Retorna um ApiResponse<LoginResponse>
 */
export const registerUser = (user: User) => {
  return apiClient<LoginResponse>("/users/register", {
    method: "POST",
    // Corpo da requisição enviado como JSON
    body: JSON.stringify(user),
  });
};

/**
 * Realiza o login do usuário.
 *
 * - Envia email e senha ao backend
 * - Espera receber token + dados públicos do usuário
 * - Toda validação de sucesso/erro é feita pelo apiClient
 */
export const loginUser = (email: string, password: string) => {
  return apiClient<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Reseta a senha de um usuário existente.
 *
 * - Envia email + nova senha
 * - Retorna a mesma estrutura de LoginResponse para consistência
 */
export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<LoginResponse> => {
  return apiClient<LoginResponse>("/users/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, password: newPassword }),
  });
};

/**
 * Verifica se um usuário existe pelo email.
 *
 * - Envia email para o backend
 * - Backend retorna "exists: true | false"
 * - Tipagem forte com CheckUserResponse
 */
export const checkUserExists = (email: string) => {
  return apiClient<CheckUserResponse>("/users/check-user-exists/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};
