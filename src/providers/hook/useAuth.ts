import { useContext } from "react";
import { AuthContext } from "@/providers/context/auth/AuthContext";

/**
 * ==================================================
 *  useAuth HOOK
 * ==================================================
 * Hook personalizado que expõe o AuthContext de forma
 * simples, segura e tipada.
 *
 * Ele centraliza o acesso aos dados e métodos de 
 * autenticação (user, token, login, logout) para qualquer
 * componente que precise disso.
 *
 * Segue o princípio de responsabilidade única (SRP):
 *   → este hook apenas recupera o contexto
 *   → e valida que ele existe
 */
export function useAuth() {
  /**
   * Obtém o valor atual de AuthContext.
   * 
   * Possíveis valores:
   *  - Um objeto válido com estado + ações de autenticação
   *  - undefined → quando o componente não está dentro de <AuthProvider />
   */
  const context = useContext(AuthContext);

  /**
   * Proteção contra uso incorreto.
   *
   * Caso o hook seja chamado fora do <AuthProvider>,
   * isso evita comportamento inesperado e facilita o debug.
   */
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  // Retorna o contexto autenticado e garantido como válido.
  return context;
}
