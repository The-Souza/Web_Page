import type { ToastProps } from "@/components/UI/toast/Toast.types";
import type { User } from "@/types/auth.types";

/**
 * ============================
 *  TOAST CONTEXT TYPE
 * ============================
 * Define o formato do contexto responsável por exibir toasts na aplicação.
 * Apenas uma função é necessária:
 *   - showToast → exibe um toast com as opções fornecidas.
 */
export interface ToastContextType {
  showToast: (options?: ToastProps) => void;
}

/**
 * ============================
 *  LOADING CONTEXT TYPE
 * ============================
 * Define o formato do contexto global de carregamento.
 * Permite que qualquer parte da aplicação:
 *   - ative um loading
 *   - desative o loading
 *   - defina uma mensagem opcional
 *   - resete o estado
 *
 * isLoading e message são expostos para componentes que precisem reagir ao estado.
 */
export interface LoadingContextType {
  // Ativa o loader com uma mensagem opcional
  show: (message?: string) => void;

  // Desativa o loader
  hide: () => void;

  // Atalho para ativar/desativar o loader manualmente
  setLoading: (loading: boolean, message?: string) => void;

  // Reseta o estado interno do loading
  reset: () => void;

  // Indica se há um carregamento ativo
  isLoading: boolean;

  // Mensagem a ser exibida durante o loading
  message?: string | null;
}

/**
 * ============================
 *  PROVIDERS ROOT PROPS
 * ============================
 * Tipagem usada pelo componente <Providers />
 * que reúne todos os contextos da aplicação.
 *
 * - children → o conteúdo da aplicação
 * - debounceSec → tempo mínimo antes de exibir loading
 * - safetySec → tempo máximo para forçar encerramento do loading
 */
export type ProvidersProps = {
  children: React.ReactNode;
  debounceSec?: number;
  safetySec?: number;
};

/**
 * ============================
 *  AUTH CONTEXT TYPE
 * ============================
 * Define o formato do contexto de autenticação.
 *
 * Expõe:
 * - isAuthenticated → indica se há um usuário logado
 * - user → dados do usuário autenticado
 * - token → token JWT armazenado
 * - login → salva token e usuário no contexto (e possivelmente localStorage)
 * - logout → limpa autenticação e estado global
 */
export interface AuthContextType {
  // true quando o usuário está logado
  isAuthenticated: boolean;

  // dados do usuário autenticado
  user: User | null;

  // token JWT (ou outro) retornado pela API
  token: string | null;

  // realiza login e configura os estados globais
  login: (token: string, user: User) => void;

  // limpa token, usuário e estado de autenticação
  logout: () => void;
}
