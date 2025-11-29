// Chave usada para armazenar o token no localStorage.
const TOKEN_KEY = "token";

// Objeto utilitário para manipular o JWT no navegador.
export const jwtUtils = {
  // Salva o token no localStorage.
  save: (token: string) => localStorage.setItem(TOKEN_KEY, token),

  // Recupera o token armazenado.
  get: () => localStorage.getItem(TOKEN_KEY),

  // Remove o token do localStorage (logout).
  remove: () => localStorage.removeItem(TOKEN_KEY),
};
