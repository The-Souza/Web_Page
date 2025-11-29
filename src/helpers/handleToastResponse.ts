import type { ToastProps } from "@/components/UI/toast/Toast.types";
import type { LoginResponse } from "@/types/auth.types";

/**
 * =============================================================
 * handleToastResponse
 * =============================================================
 * Função utilitária para exibir toasts (mensagens temporárias)
 * com base na resposta de uma operação, como login ou cadastro.
 *
 * Parâmetros:
 * - response: LoginResponse → objeto retornado da operação (success, message)
 * - showToast: função que exibe o toast, recebendo ToastProps
 * - successTitle: título padrão para toasts de sucesso (opcional)
 * - errorTitle: título padrão para toasts de erro (opcional)
 * - successText: texto adicional para sucesso (opcional)
 * - errorText: texto adicional para erro (opcional)
 *
 * Comportamento:
 * - Se response.success === true, exibe toast de sucesso.
 * - Se response.success === false, exibe toast de erro.
 * - Mensagem padrão é usada se successText ou errorText não forem fornecidos.
 */
export function handleToastResponse(
  response: LoginResponse,
  showToast: (toast: ToastProps) => void,
  successTitle = "Success",
  errorTitle = "Error",
  successText?: string,
  errorText?: string
) {
  if (response.success) {
    // Exibe toast de sucesso
    showToast({
      type: "success",
      title: successTitle,
      text: successText || response.message || "Operation completed successfully.",
    });
  } else {
    // Exibe toast de erro
    showToast({
      type: "error",
      title: errorTitle,
      text: errorText || response.message || "An unexpected error occurred.",
    });
  }
}
