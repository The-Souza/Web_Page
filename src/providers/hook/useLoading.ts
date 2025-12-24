import { useContext } from "react";
import { LoadingContext } from "@/providers/context/loading/LoadingContext";
import type { LoadingContextType } from "../provider.types";

/**
 * ==================================================
 *  useLoading HOOK
 * ==================================================
 * Hook personalizado para acessar o LoadingContext.
 *
 * Ele fornece:
 *   - show() para exibir o loading
 *   - hide() para ocultar
 *   - setLoading() para controle manual
 *   - reset() para restaurar o estado
 *   - isLoading e message para leitura do estado atual
 *
 * Responsabilidade única:
 *   → Apenas recupera e valida o contexto.
 */
export function useLoading(): LoadingContextType {
  /**
   * Obtém o valor atual do LoadingContext.
   * 
   * Caso o componente não esteja dentro do <LoadingProvider>,
   * o valor retornado será undefined.
   */
  const ctx = useContext<LoadingContextType | undefined>(LoadingContext);

  /**
   * Garante que o hook só seja utilizado dentro do provider.
   * Sem essa verificação, o app poderia falhar silenciosamente
   * e criar comportamentos difíceis de depurar.
   */
  if (!ctx) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  // Com segurança garantida, retorna o contexto.
  return ctx;
}
