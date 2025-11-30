import { useRef, useCallback } from "react";
import { Toast } from "@/components/UI/toast/Toast";
import { ToastContext } from "./ToastContext";
import type { ProvidersProps } from "../../provider.types";
import type { ToastProps } from "@/components/UI/toast/Toast.types";
import type { ToastContextType } from "../../provider.types";

/**
 * ==================================================
 *  ToastProvider
 * ==================================================
 * Provider responsável por expor a função `showToast`
 * via contexto, permitindo que qualquer componente
 * da aplicação dispare toasts sem precisar acessar
 * diretamente o componente <Toast />.
 *
 * O ToastProvider injeta dentro do contexto apenas
 * uma função simples:
 *     showToast(options)
 *
 * O componente <Toast /> é renderizado uma única vez
 * aqui no provider e controlado através de um `ref`.
 */
export function ToastProvider({ children }: ProvidersProps) {
  /**
   * --------------------------------------------------
   * toastRef
   * --------------------------------------------------
   * Referência que conecta o provider ao componente <Toast />.
   *
   * O componente Toast expõe um método interno `showToast()`
   * via forwardRef. Aqui nós acessamos esse método usando
   * toastRef.current.
   *
   * O tipo ToastContextType garante que o método exista.
   */
  const toastRef = useRef<ToastContextType>(null);

  /**
   * --------------------------------------------------
   * showToast()
   * --------------------------------------------------
   * Função acessível globalmente via contexto.
   *
   * Ela apenas encaminha a chamada para o método
   * `showToast()` do componente <Toast />, acessado
   * através do ref.
   *
   * `useCallback` evita recriação da função desnecessária.
   */
  const showToast = useCallback((options: ToastProps = {}) => {
    toastRef.current?.showToast(options);
  }, []);

  /**
   * --------------------------------------------------
   * hideToast()
   * --------------------------------------------------
   * Função acessível globalmente via contexto.
   *
   * Ela apenas encaminha a chamada para o método
   * `hideToast()` do componente <Toast />, acessado
   * através do ref.
   *
   * `useCallback` evita recriação da função desnecessária.
   */
  const hideToast = useCallback(() => {
    toastRef.current?.hideToast?.();
  }, []);

  /**
   * --------------------------------------------------
   * JSX renderizado
   * --------------------------------------------------
   * - Fornece `showToast`e `hideToast` para toda a aplicação.
   * - Renderiza o `<Toast />` no final do DOM, garantindo
   *   que toasts possam ser disparados de qualquer lugar.
   */
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Render único do Toast, controlado via ref */}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
}
