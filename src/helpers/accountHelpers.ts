import type { Account } from "@/models/account.types";
import type { MonthSummary } from "@/models/account.types";

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
 * Calcula os totais do mês
 */
export function calculateMonthSummary(
  accounts: Account[],
  month: string
): MonthSummary {
  const monthAccounts = accounts.filter((acc) => acc.month === month);
  const totalValue = monthAccounts.reduce((acc, a) => acc + a.value, 0);
  const paidValue = monthAccounts
    .filter((a) => a.paid)
    .reduce((acc, a) => acc + a.value, 0);
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
 * Calcula a diferença do mês atual para o anterior
 */
export function getDiffFromLastMonth(
  current: MonthSummary,
  previous: MonthSummary
): number {
  return current.totalValue - previous.totalValue;
}

/**
 * Calcula o resumo por tipo de conta
 */
export function calculateAccountTypeSummary(
  accounts: Account[],
  month: string
) {
  const monthAccounts = accounts.filter((acc) => acc.month === month);
  const types = Array.from(new Set(monthAccounts.map((a) => a.accountType)));

  return types.map((type) => {
    const accs = monthAccounts.filter((a) => a.accountType === type);
    const totalValue = accs.reduce((acc, a) => acc + a.value, 0);
    const paidValue = accs
      .filter((a) => a.paid)
      .reduce((acc, a) => acc + a.value, 0);
    const unpaidValue = totalValue - paidValue;

    return { type, totalValue, paidValue, unpaidValue };
  });
}

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

/**
 * Retorna todos os anos disponíveis nos dados
 */
export function getAvailableYears(accounts: Account[]): string[] {
  const years = accounts.map((acc) => acc.year.toString());
  return Array.from(new Set(years));
}

/**
 * Retorna os meses disponíveis para um ano específico no formato MM/YYYY
 */
export function getMonthsByYear(accounts: Account[], year: string): string[] {
  const months = accounts
    .filter((a) => a.year.toString() === year)
    .map((a) => a.month);
  return Array.from(new Set(months));
}
