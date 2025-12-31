/**
 * Cores padrão para status e indicadores na página Home
 * ------------------------------------------------------
 * paid     -> cor verde (hex) para contas pagas
 * unpaid   -> cor vermelha (hex) para contas não pagas
 * positive -> classe Tailwind para indicar valor positivo
 * negative -> classe Tailwind para indicar valor negativo
 */
export const COLORS = {
  paid: "#00ff9f",
  unpaid: "#ff4444",
  positive: "text-textColorCard",
  negative: "text-red-500",
};

/**
 * Tipos de contas usados na página Home
 * -------------------------------------
 * Valores possíveis: "Water", "Energy", "Gas", "Internet"
 * Utilizados para filtrar ou exibir informações das contas
 */
export const ACCOUNT_TYPES = ["Water", "Energy", "Gas", "Internet"];
