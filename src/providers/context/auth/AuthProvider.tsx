import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "@/types/auth.types";

/**
 * ============================================================
 * AuthProvider
 * ============================================================
 * Provider que encapsula toda a lógica de autenticação da aplicação.
 * Ele disponibiliza o AuthContext para qualquer componente que use o hook `useAuth()`.
 *
 * Responsabilidades:
 * - Gerenciar estado de autenticação (token, usuário)
 * - Persistir dados no localStorage
 * - Sincronizar login/logout entre abas
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * Estado do token JWT
   * Inicializa com o valor salvo no localStorage (ou null se não existir)
   */
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  /**
   * Estado do usuário autenticado
   * Inicializa com os dados salvos no localStorage (ou null se não existir)
   */
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  /**
   * Booleano que indica se o usuário está autenticado
   * Determinado pela presença de um token válido
   */
  const isAuthenticated = !!token;

  /**
   * ------------------------------------------------------------
   * Sincronização entre abas/janelas
   * ------------------------------------------------------------
   * Se o usuário fizer login ou logout em outra aba, o evento
   * 'storage' é disparado e atualiza o estado aqui.
   */
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token")); // atualiza token
      setUser(JSON.parse(localStorage.getItem("user") || "null")); // atualiza usuário
    };

    window.addEventListener("storage", syncAuth);

    // Remove listener quando o componente for desmontado
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  /**
   * ------------------------------------------------------------
   * Função de login
   * ------------------------------------------------------------
   * - Salva token e usuário no localStorage
   * - Atualiza os estados internos (token e usuário)
   * 
   * useCallback garante que a função mantenha a mesma referência,
   * evitando re-renderizações desnecessárias em componentes que dependem dela
   */
  const login = useCallback((tokenValue: string, userData: User) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(tokenValue); // atualiza estado local
    setUser(userData); // atualiza estado local
  }, []);

  /**
   * ------------------------------------------------------------
   * Função de logout
   * ------------------------------------------------------------
   * - Remove token e usuário do localStorage
   * - Limpa os estados internos (token e usuário)
   * 
   * Pode ser usado de forma assíncrona com loaders, se necessário.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null); // limpa estado
    setUser(null); // limpa estado
  }, []);

  /**
   * ------------------------------------------------------------
   * AuthContext.Provider
   * ------------------------------------------------------------
   * Disponibiliza os valores e funções de autenticação para todos
   * os componentes filhos que consumirem o contexto via `useAuth()`.
   */
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
