import { useContext } from "react";
import { ToastContext } from "@/providers/context/toast/ToastContext";
import type { ToastContextType } from "../provider.types";

/**
 * ============================
 *  useToast HOOK
 * ============================
 * Hook personalizado que expõe o contexto de Toast de forma tipada.
 *
 * Ele funciona como uma "interface pública" para qualquer componente
 * que precise exibir mensagens toast.
 *
 * Benefícios:
 * - Garante tipagem estrita (ToastContextType)
 * - Protege contra uso incorreto (erro se usado fora do provider)
 * - Mantém o isolamento de responsabilidades (SRP)
 */
export function useToast(): ToastContextType {
  /**
   * Recupera o contexto criado em ToastProvider.
   * Pode ser:
   *  - um objeto ToastContextType válido
   *  - undefined (quando o Provider não envolve o componente)
   */
  const context = useContext<ToastContextType | undefined>(ToastContext);

  /**
   * 🔥 IMPORTANTE
   * Se alguém tentar usar o hook fora do <ToastProvider>,
   * o contexto será undefined.
   *
   * Nesse caso, lançamos um erro claro, ajudando no debug.
   *
   * Exemplo de erro:
   * "useToast must be used within a ToastProvider"
   */
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  // Como o contexto existe, retornamos ele tipado corretamente.
  return context;
}
