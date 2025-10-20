import type { Account, MonthSummary } from "@/models/account.types";

/* -------------------------------------------------------------------------- */
/* 🧮 Generic Utilities */
/* -------------------------------------------------------------------------- */

/**
 * Soma os valores de uma lista de contas, com ou sem condição.
 */
function sumValues(accounts: Account[], predicate?: (acc: Account) => boolean): number {
  const filtered = predicate ? accounts.filter(predicate) : accounts;
  return filtered.reduce((acc, a) => acc + a.value, 0);
}

/**
 * Retorna um conjunto único de valores de um campo.
 */
function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

/* -------------------------------------------------------------------------- */
/* 📅 Date Helpers */
/* -------------------------------------------------------------------------- */

/**
 * Retorna a string do mês anterior no formato MM/YYYY
 */
export function getPreviousMonth(month: string): string {
  const [m, y] = month.split("/").map(Number);
  const date = new Date(y, m - 2); // mês anterior
  const newMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const newYear = date.getFullYear();
  return `${newMonth}/${newYear}`;
}

/**
 * Retorna todos os anos disponíveis nos dados
 */
export function getAvailableYears(accounts: Account[]): string[] {
  const years = accounts.map((a) => a.year.toString());
  return unique(years);
}

/**
 * Retorna os meses disponíveis para um ano específico no formato MM/YYYY
 */
export function getMonthsByYear(accounts: Account[], year: string): string[] {
  const months = accounts
    .filter((a) => a.year.toString() === year)
    .map((a) => a.month);

  // Ordena os meses de 01 a 12
  return unique(months).sort((a, b) => {
    const [ma, ya] = a.split("/").map(Number);
    const [mb, yb] = b.split("/").map(Number);
    return ya === yb ? ma - mb : ya - yb;
  });
}

/* -------------------------------------------------------------------------- */
/* 💰 Calculations */
/* -------------------------------------------------------------------------- */

/**
 * Objeto vazio para quando não houver dados selecionados
 */
export const emptySummary: MonthSummary = {
  totalValue: 0,
  paidValue: 0,
  unpaidValue: 0,
  paidPercentage: 0,
  diffFromLastMonth: 0,
};

/**
 * Calcula o resumo financeiro de um mês específico.
 */
export function computeMonthSummary(accounts: Account[], month: string): MonthSummary {
  const monthAccounts = accounts.filter((acc) => acc.month === month);

  if (monthAccounts.length === 0) return emptySummary;

  const totalValue = sumValues(monthAccounts);
  const paidValue = sumValues(monthAccounts, (a) => a.paid);
  const unpaidValue = totalValue - paidValue;
  const paidPercentage = totalValue > 0 ? (paidValue / totalValue) * 100 : 0;

  return {
    totalValue,
    paidValue,
    unpaidValue,
    paidPercentage,
    diffFromLastMonth: 0,
  };
}

/**
 * Calcula a diferença de total entre o mês atual e o anterior.
 */
export function getDiffFromLastMonth(current: MonthSummary, previous: MonthSummary): number {
  return current.totalValue - previous.totalValue;
}

/**
 * Calcula o resumo agrupado por tipo de conta.
 */
export function computeAccountTypeSummary(accounts: Account[], month: string) {
  const monthAccounts = accounts.filter((acc) => acc.month === month);
  const types = unique(monthAccounts.map((a) => a.accountType));

  return types.map((type) => {
    const filtered = monthAccounts.filter((a) => a.accountType === type);
    const totalValue = sumValues(filtered);
    const paidValue = sumValues(filtered, (a) => a.paid);
    const unpaidValue = totalValue - paidValue;

    return { type, totalValue, paidValue, unpaidValue };
  });
}

/* -------------------------------------------------------------------------- */
/* 💵 Formatting */
/* -------------------------------------------------------------------------- */

/**
 * Formata número em moeda BRL
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
