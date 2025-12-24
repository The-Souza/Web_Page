import type { ToastProps } from "./Toast.types";

/**
 * defaultToast
 * ------------------------------------------------------------
 * Configuração padrão para toasts.
 * Usado como fallback caso alguma propriedade não seja fornecida.
 */
export const defaultToast: Required<Omit<ToastProps, "onClose">> = {
  type: "info",           // Tipo do toast (info, success, warning, error)
  title: "Notification",  // Título padrão do toast
  text: "",               // Texto padrão do toast (vazio)
  duration: 3,            // Duração em segundos antes de sumir automaticamente
  dock: "top-center",       // Posição padrão na tela
};
