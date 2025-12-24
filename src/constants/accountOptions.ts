// -----------------------------------------------------------------------------
// Opções de tipos de conta disponíveis no sistema.
// Centralizar isso evita strings soltas ("magic strings") espalhadas pelo código
// e facilita manutenção, tradução ou inclusão de novos tipos no futuro.
// -----------------------------------------------------------------------------
export const ACCOUNT_TYPE_OPTIONS = [
  { label: "Water", value: "Water" },
  { label: "Energy", value: "Energy" },
  { label: "Gas", value: "Gas" },
  { label: "Internet", value: "Internet" },
];

// -----------------------------------------------------------------------------
// Ano base utilizado para geração dinâmica da lista de anos.
// Mantido como constante para evitar valores hardcoded em múltiplos lugares.
// -----------------------------------------------------------------------------
export const CURRENT_YEAR = 2024;

// -----------------------------------------------------------------------------
// Gera uma lista de anos a partir do ano atual.
// A abordagem dinâmica reduz necessidade de manutenção anual no código.
// -----------------------------------------------------------------------------
export const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => {
  const year = CURRENT_YEAR + i;

  return {
    label: String(year),
    value: String(year),
  };
});

// -----------------------------------------------------------------------------
// Lista de meses no formato "01" a "12".
// O padStart garante consistência visual e evita tratamentos adicionais no form.
// -----------------------------------------------------------------------------
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0");

  return {
    label: month,
    value: month,
  };
});
