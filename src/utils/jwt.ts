const TOKEN_KEY = "token";

export const jwtUtils = {
  save: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  get: () => localStorage.getItem(TOKEN_KEY),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};
