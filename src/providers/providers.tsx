import { ToastProvider } from "./context/toast/ToastProvider";
import { LoadingProvider } from "./context/loading/LoadingProvider";
import type { ProvidersProps } from "./provider.types";
import { AuthProvider } from "./context/auth/AuthProvider";

/**
 * Componente que agrupa todos os Providers globais da aplicação.
 *
 * Ele envolve toda a aplicação com contextos essenciais:
 * - AuthProvider → controla estado de autenticação
 * - LoadingProvider → controla loaders globais e debounce
 * - ToastProvider → exibe mensagens temporárias (sucesso, erro, info)
 *
 * A ORDEM dos providers importa:
 *   -> AuthProvider vem primeiro, pois o Loading e o Toast podem depender dele.
 *   -> LoadingProvider fica acima do Toast para permitir exibir loading durante notificações.
 */
export function Providers({
  children,
  debounceSec,
  safetySec,
}: ProvidersProps) {
  return (
    <AuthProvider>
      {/* Controla loaders globais, com debounce e timeout de segurança */}
      <LoadingProvider debounceSec={debounceSec} safetySec={safetySec}>
        
        {/* Provider responsável por toasts/alertas visuais */}
        <ToastProvider>
          {children}
        </ToastProvider>

      </LoadingProvider>
    </AuthProvider>
  );
}
