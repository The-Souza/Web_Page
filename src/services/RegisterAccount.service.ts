import { apiClient } from "./ApiClient.service";
import type { Account, RegisterAccountPayload } from "@/types/account.types";

/**
 * Registra uma nova conta do usuário.
 *
 * - Usa o apiClient para padronizar o retorno (ApiResponse<Account>)
 * - Envia o token via Bearer Authorization
 * - Transforma o payload em JSON
 * - Retorna a resposta já validada pelo apiClient
 */
export const registerAccount = (
  payload: RegisterAccountPayload,
  token: string
) => {
  return apiClient<Account>("/accounts/register-account", {
    method: "POST",
    headers: {
      // Token JWT enviado como Bearer
      Authorization: `Bearer ${token}`,
    },
    // Corpo da requisição convertido para JSON
    body: JSON.stringify(payload),
  });
};

/**
 * Obtém todas as contas do usuário autenticado.
 *
 * - Chamado sem opções adicionais (GET padrão)
 * - Espera uma lista de contas tipada como Account[]
 */
export const getAccounts = (email: string) => {
  return apiClient<Account[]>(`/accounts/email/${email}`);
};

/**
 * Atualiza uma conta existente do usuário.
 *
 * - Recebe o ID da conta e um payload parcial (Partial<Account>)
 *   permitindo atualizar apenas os campos necessários.
 * - Método PATCH → atualização parcial de recurso.
 * - Envia token JWT no header Authorization como Bearer.
 * - Envia o payload em formato JSON.
 * - Retorna a conta atualizada já validada pelo apiClient.
 */
export const updateAccount = (
  accountId: number,
  payload: Partial<Account>,
  token: string
) => {
  return apiClient<Account>(`/accounts/${accountId}`, {
    method: "PATCH",
    headers: {
      // Token JWT obrigatório para autorizar a operação
      Authorization: `Bearer ${token}`,
    },
    // Conteúdo enviado ao backend convertidos para JSON
    body: JSON.stringify(payload),
  });
};

/**
 * Deleta uma conta existente pelo ID.
 *
 * - Usa DELETE → remoção completa do recurso.
 * - Requer token JWT enviado como Bearer para autorização.
 * - Não precisa de body na requisição.
 * - O retorno esperado é null, mas ainda dentro do padrão ApiResponse.
 */
export const deleteAccount = (accountId: number, token: string) => {
  return apiClient<null>(`/accounts/${accountId}`, {
    method: "DELETE",
    headers: {
      // Token JWT garantindo que o usuário tem permissão para excluir
      Authorization: `Bearer ${token}`,
    },
  });
};

