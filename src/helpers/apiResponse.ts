import type { ApiResponse } from "@/types/apiResponse.types";

/**
 * =============================================================
 * apiResponse
 * =============================================================
 * Objeto utilitário para padronizar respostas de APIs dentro
 * da aplicação. Ele facilita criar respostas consistentes
 * para sucesso, erro ou validação.
 *
 * Cada método retorna um objeto ApiResponse<T> com:
 * - success: boolean → indica se a operação foi bem-sucedida
 * - message: string | undefined → mensagem opcional para exibir
 * - data: T | null → dados retornados da operação
 */
export const apiResponse = {

  /**
   * Retorna uma resposta de sucesso com dados.
   * @param data → dados a serem retornados
   * @param message → mensagem opcional
   */
  ok<T>(data: T, message?: string): ApiResponse<T> {
    return { success: true, message, data };
  },

  /**
   * Retorna uma resposta de sucesso sem dados, apenas mensagem.
   * @param message → mensagem opcional, padrão: "Operation completed successfully"
   */
  success(message = "Operation completed successfully"): ApiResponse<null> {
    return { success: true, message, data: null };
  },

  /**
   * Retorna uma resposta de erro genérico.
   * @param message → mensagem opcional, padrão: "An error occurred"
   */
  error<T>(message = "An error occurred"): ApiResponse<T> {
    return { success: false, message, data: null as T };
  },

  /**
   * Retorna uma resposta de validação, indicando erro de input ou regras de negócio.
   * @param message → mensagem descritiva do erro de validação
   */
  validation<T>(message: string): ApiResponse<T> {
    return { success: false, message, data: null as T };
  },
};
