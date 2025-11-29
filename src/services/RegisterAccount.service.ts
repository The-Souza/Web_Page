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
  return apiClient<Account>("/accounts", {
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
export const getAccounts = () => apiClient<Account[]>("/accounts");
