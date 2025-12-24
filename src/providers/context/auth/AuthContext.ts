import { createContext } from "react";
import type { AuthContextType } from "@/providers/provider.types";

/**
 * ============================================================
 * AuthContext
 * ============================================================
 * Este contexto é responsável por disponibilizar, para toda a
 * aplicação, as informações e funções relacionadas à autenticação:
 *
 *  - isAuthenticated → indica se o usuário está logado
 *  - user            → dados do usuário
 *  - token           → token JWT armazenado
 *  - login()         → função para salvar usuário + token
 *  - logout()        → função para limpar autenticação
 *
 * O contexto é inicializado como "undefined" para que
 * possamos detectar erros quando o hook `useAuth()` for
 * usado fora do `<AuthProvider>`.
 *
 * Isso permite mensagens de erro úteis no desenvolvimento.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
