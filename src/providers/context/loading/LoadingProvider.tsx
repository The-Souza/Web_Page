import { useCallback, useState } from "react";
import { LoadingContext } from "./LoadingContext";
import LoadingOverlay from "@/providers/context/loading/LoadingOverlay";
import { useLocation } from "react-router-dom";
import type { ProvidersProps } from "../../provider.types";
import { ROUTE_MESSAGES } from "@/types/routeMessages.variants";

/**
 * LoadingProvider
 * ------------------------------------------------------------
 * Componente de contexto responsável por gerenciar o estado global de loading
 * da aplicação. Fornece funções e estado para exibir overlays de loading com
 * mensagens contextuais durante navegação ou ações assíncronas.
 *
 * Funcionalidades principais:
 * - show(msg?): exibe o overlay de loading com a mensagem fornecida
 *   ou, se não fornecida, usa a mensagem padrão da rota atual (ROUTE_MESSAGES).
 * - hide(): esconde o overlay de loading.
 * - setLoading(loading, msg?): atalho para show/hide baseado em booleano.
 * - reset(): reseta o estado de loading e mensagem.
 *
 * Estado interno:
 * - isLoading: booleano indicando se o overlay está ativo.
 * - message: string com a mensagem atual do overlay (ou null).
 *
 * Uso:
 * - Envolver a aplicação com <LoadingProvider> para permitir que qualquer
 *   componente use o LoadingContext e controle o overlay globalmente.
 *
 * Observações:
 * - ROUTE_MESSAGES: objeto que mapeia rotas para mensagens de loading padrão.
 * - O overlay <LoadingOverlay> é renderizado automaticamente enquanto isLoading = true.
 */
export function LoadingProvider({ children }: ProvidersProps) {
  const location = useLocation(); // pega a rota atual
  const [isLoading, setIsLoading] = useState(false); // controla visibilidade do overlay
  const [message, setMessage] = useState<string | null>(null); // mensagem exibida no overlay

  // Exibe o loading com mensagem
  const show = useCallback(
    (msg?: string) => {
      // prioridade: msg passada > mensagem da rota > "Loading..."
      const finalMsg = msg ?? ROUTE_MESSAGES[location.pathname] ?? "Loading...";
      setMessage(finalMsg);
      setIsLoading(true);
    },
    [location.pathname]
  );

  // Esconde o loading
  const hide = useCallback(() => {
    setIsLoading(false);
    setMessage(null);
  }, []);

  // Atalho para show/hide baseado em booleano
  const setLoading = useCallback(
    (loading: boolean, msg?: string) => {
      if (loading) show(msg);
      else hide();
    },
    [show, hide]
  );

  // Reseta o estado de loading e mensagem
  const reset = useCallback(() => {
    setIsLoading(false);
    setMessage(null);
  }, []);

  return (
    <LoadingContext.Provider
      value={{ show, hide, setLoading, reset, isLoading, message }}
    >
      {children}
      {/* Overlay global de loading */}
      {isLoading && <LoadingOverlay message={message ?? undefined} />}
    </LoadingContext.Provider>
  );
}

export default LoadingProvider;
