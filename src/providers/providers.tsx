import { ToastProvider } from "./context/toast/ToastProvider";
import { LoadingProvider } from "./context/loading/LoadingProvider";
import type { ProvidersProps } from "./provider.types";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ThemeProvider } from "@/providers/context/theme/ThemeProvider";

/**
 * Componente que agrupa todos os Providers globais da aplicação.
 *
 * Ele envolve toda a aplicação com contextos essenciais:
 * - AuthProvider → controla estado de autenticação
 * - LoadingProvider → controla loaders globais e debounce
 * - ToastProvider → exibe mensagens temporárias (sucesso, erro, info)
 * - ThemeProvider → gerencia tema claro/escuro
 * 
 * A ORDEM dos providers importa:
 *   -> AuthProvider vem primeiro, pois o Loading e o Toast podem depender dele.
 *   -> LoadingProvider fica acima do Toast para permitir exibir loading durante notificações.
 *   -> ThemeProvider envolve tudo para que todos os contextos tenham acesso ao tema.
 */
export function Providers({
  children,
  debounceSec,
  safetySec,
}: ProvidersProps) {
  return (
    <AuthProvider>
      {/* Controla loaders globais, com debounce e timeout de segurança */}
      <ThemeProvider>
        <LoadingProvider debounceSec={debounceSec} safetySec={safetySec}>
          {/* Provider responsável por toasts/alertas visuais */}
          <ToastProvider>{children}</ToastProvider>
        </LoadingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
