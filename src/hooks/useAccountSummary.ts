import { useMemo, useState } from "react";
import {
  getPreviousMonth,
  computeMonthSummary,
  computeAccountTypeSummary,
  getDiffFromLastMonth,
  emptySummary,
  getAvailableYears,
  getMonthsByYear,
} from "@/helpers/accountHelpers";
import type { Account } from "@/types/account.types";

/**
 * useAccountSummary
 * ------------------------------------------------------------
 * Hook customizado para gerenciar o resumo financeiro de contas.
 *
 * Ele:
 * - Mantém o estado do ano e mês selecionados
 * - Calcula resumos mensais e por tipo de conta
 * - Calcula diferenças em relação ao mês anterior
 * - Fornece listas de anos e meses disponíveis para seleção
 *
 * @param accounts → lista completa de contas
 */
export function useAccountSummary(accounts: Account[]) {
  // Estados para ano e mês selecionados pelo usuário
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Lista de anos disponíveis nos dados
  const availableYears = useMemo(() => getAvailableYears(accounts), [accounts]);

  // Lista de meses disponíveis para o ano selecionado
  const availableMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getMonthsByYear(accounts, selectedYear);
  }, [accounts, selectedYear]);

  // Indica se o usuário selecionou ano e mês
  const isSelectionComplete = !!selectedYear && !!selectedMonth;

  // Filtra contas correspondentes ao mês selecionado
  const accountsForSelectedMonth = useMemo(() => {
    if (!isSelectionComplete) return [];
    return accounts.filter((acc) => acc.month === selectedMonth);
  }, [accounts, selectedMonth, isSelectionComplete]);

  // Calcula mês anterior ao selecionado
  const previousMonth = useMemo(() => {
    if (!isSelectionComplete) return "";
    return getPreviousMonth(selectedMonth);
  }, [selectedMonth, isSelectionComplete]);

  // Resumo do mês selecionado
  const currentSummary = useMemo(() => {
    if (!isSelectionComplete || accountsForSelectedMonth.length === 0)
      return emptySummary;

    return computeMonthSummary(accountsForSelectedMonth, selectedMonth);
  }, [accountsForSelectedMonth, selectedMonth, isSelectionComplete]);

  // Resumo do mês anterior
  const previousSummary = useMemo(() => {
    if (!isSelectionComplete || !previousMonth) return emptySummary;

    // 🔹 Padroniza formato dos meses (MM/YYYY)
    const normalizedAccounts = accounts.map((acc) => ({
      ...acc,
      month: acc.month.padStart(7, "0"),
    }));
    const normalizedPrevMonth = previousMonth.padStart(7, "0");

    // 🔹 Verifica se existem dados do mês anterior
    const hasPreviousMonthData = normalizedAccounts.some(
      (acc) => acc.month === normalizedPrevMonth
    );

    if (!hasPreviousMonthData) return emptySummary;

    // 🔹 Calcula resumo do mês anterior
    return computeMonthSummary(
      normalizedAccounts.filter((acc) => acc.month === normalizedPrevMonth),
      normalizedPrevMonth
    );
  }, [accounts, previousMonth, isSelectionComplete]);

  // Diferença total entre o mês atual e o anterior
  const diffFromLastMonth = useMemo(() => {
    if (!isSelectionComplete) return 0;

    const hasPreviousData = previousSummary.totalValue > 0;
    if (!hasPreviousData) return 0;

    return getDiffFromLastMonth(currentSummary, previousSummary);
  }, [currentSummary, previousSummary, isSelectionComplete]);

  // Resumo agrupado por tipo de conta
  const accountTypeSummary = useMemo(() => {
    const allTypes = Array.from(new Set(accounts.map((a) => a.accountType)));

    // Caso a seleção não esteja completa, retorna zeros
    if (!isSelectionComplete || accountsForSelectedMonth.length === 0) {
      return allTypes.map((type) => ({
        type,
        totalValue: 0,
        paidValue: 0,
        unpaidValue: 0,
      }));
    }

    return computeAccountTypeSummary(accountsForSelectedMonth, selectedMonth);
  }, [accountsForSelectedMonth, selectedMonth, isSelectionComplete, accounts]);

  // Resumo de todos os meses de um ano selecionado
  const monthSummaries = useMemo(() => {
    if (!isSelectionComplete) {
      // Se não houver seleção, retorna 12 meses do ano atual com resumo vazio
      return Array.from({ length: 12 }, (_, i) => ({
        month: `${String(i + 1).padStart(2, "0")}/${new Date().getFullYear()}`,
        summary: emptySummary,
      }));
    }

    const months = getMonthsByYear(accounts, selectedYear);
    return months.map((m) => ({
      month: m,
      summary: computeMonthSummary(
        accounts.filter((acc) => acc.month === m),
        m
      ),
    }));
  }, [accounts, selectedYear, isSelectionComplete]);

  return {
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    availableYears,
    availableMonths,
    accountsForSelectedMonth,
    currentSummary,
    diffFromLastMonth,
    accountTypeSummary,
    monthSummaries,
  };
}
