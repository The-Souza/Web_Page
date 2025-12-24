/**
 * Mensagens padrão de loading por rota
 * ------------------------------------
 * Este objeto mapeia cada rota da aplicação para a mensagem
 * que deve ser exibida no overlay de loading.
 * 
 * Exemplos:
 * "/home"              -> "Loading home page..."
 * "/register-account"  -> "Loading account registration..."
 * "/"                   -> "Logging in..."
 * "/signup"             -> "Creating account..."
 * "/reset-password"     -> "Changing password..."
 *
 * Usado principalmente pelo LoadingProvider para mostrar
 * mensagens contextuais durante navegação ou ações assíncronas.
 */
export const ROUTE_MESSAGES: Record<string, string> = {
  "/home": "Loading home page...",
  "/register-account": "Loading accounts...",
  "/": "Logging in...",
  "/signup": "Creating account...",
  "/reset-password": "Changing password...",
};
