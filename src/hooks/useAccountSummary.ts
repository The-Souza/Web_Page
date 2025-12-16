import { useMemo, useState } from "react";
import {
  computeMonthSummary,
  computeAccountTypeSummary,
  getAvailableYears,
  getMonthsByYear,
  getPreviousMonth,
  getDiffFromLastMonth,
  emptySummary,
} from "@/helpers/accountHelpers";
import type { Account } from "@/types/account.types";

/**
 * useAccountSummary
 * ------------------------------------------------------------
 * Hook responsável por gerar resumos filtrados das contas.
 *
 * Ele calcula:
 * - Filtros (ano, mês, tipo)
 * - Resumos mensais
 * - Resumo por tipo de conta
 * - Diferença com o mês anterior
 * - Meses e anos disponíveis
 *
 * Usado principalmente na Home e parcialmente no RegisterAccount.
 */
export function useAccountSummary(accounts: Account[]) {
  // ------------------------------
  // 🔹 ESTADOS DE FILTRO DO USUÁRIO
  // ------------------------------
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPaid, setSelectedPaid] = useState<boolean | "">("");

  // ------------------------------
  // 🔹 LISTAGEM DE ANOS DISPONÍVEIS
  // ------------------------------
  const availableYears = useMemo(() => getAvailableYears(accounts), [accounts]);

  // ------------------------------
  // 🔹 LISTAGEM DE MESES DISPONÍVEIS PARA UM ANO
  // ------------------------------
  const availableMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getMonthsByYear(accounts, selectedYear);
  }, [accounts, selectedYear]);

  // ------------------------------
  // 🔹 TIPOS DE CONTAS DISPONÍVEIS
  // ------------------------------
  const availableTypes = useMemo(() => {
    // Usa Set para evitar duplicados
    return Array.from(new Set(accounts.map((a) => a.accountType)));
  }, [accounts]);

  // ------------------------------
  // 🔹 LISTAGEM DE CNTAS PAGAS/NÃO PAGAS
  // ------------------------------
  const availablePaids = useMemo(() => {
    // Usa Set para evitar duplicados
    return Array.from(new Set(accounts.map((a) => a.paid)));
  }, [accounts]);

  // ============================================================
  // 🧹 FILTRAGEM PRINCIPAL USADA NA PAGE RegisterAccount
  // ============================================================
  const filteredAccounts = useMemo(() => {
    let result = accounts;

    // Aplica filtro progressivo
    if (selectedYear) {
      result = result.filter((acc) => String(acc.year) === selectedYear);
    }

    if (selectedMonth) {
      result = result.filter((acc) => acc.month === selectedMonth);
    }

    if (selectedType) {
      result = result.filter((acc) => acc.accountType === selectedType);
    }

    if (selectedPaid !== "") {
      result = result.filter((acc) => acc.paid === selectedPaid);
    }

    return result;
  }, [accounts, selectedYear, selectedMonth, selectedType, selectedPaid]);

  // ============================================================
  // 🏠 CÁLCULOS EXCLUSIVOS DA HOME (não usados na página de registro)
  // ============================================================

  // Verifica se o usuário selecionou ano e mês
  const isSelectionComplete = !!selectedYear && !!selectedMonth;

  // Contas do mês selecionado
  const accountsForSelectedMonth = useMemo(() => {
    if (!isSelectionComplete) return [];
    return accounts.filter((acc) => acc.month === selectedMonth);
  }, [accounts, selectedMonth, isSelectionComplete]);

  // Obtém o mês anterior no formato MM/YYYY
  const previousMonth = useMemo(() => {
    if (!isSelectionComplete) return "";
    return getPreviousMonth(selectedMonth);
  }, [selectedMonth, isSelectionComplete]);

  // ------------------------------
  // 🔹 Resumo do mês selecionado
  // ------------------------------
  const currentSummary = useMemo(() => {
    if (!isSelectionComplete || accountsForSelectedMonth.length === 0)
      return emptySummary;

    return computeMonthSummary(accountsForSelectedMonth, selectedMonth);
  }, [accountsForSelectedMonth, selectedMonth, isSelectionComplete]);

  // ------------------------------
  // 🔹 Resumo do mês anterior
  // ------------------------------
  const previousSummary = useMemo(() => {
    if (!isSelectionComplete || !previousMonth) return emptySummary;

    // Normaliza formato (MM/YYYY)
    const normalizedAccounts = accounts.map((acc) => ({
      ...acc,
      month: acc.month ? acc.month.padStart(7, "0") : "", // Verifica se `month` não é undefined
    }));
    const normalizedPrevMonth = previousMonth
      ? previousMonth.padStart(7, "0")
      : "";

    // Verifica se existe registro do mês anterior
    const hasPreviousMonthData = normalizedAccounts.some(
      (acc) => acc.month === normalizedPrevMonth
    );

    if (!hasPreviousMonthData) return emptySummary;

    // Retorna resumo
    return computeMonthSummary(
      normalizedAccounts.filter((acc) => acc.month === normalizedPrevMonth),
      normalizedPrevMonth
    );
  }, [accounts, previousMonth, isSelectionComplete]);

  // ------------------------------
  // 🔹 Diferença entre mês atual e anterior
  // ------------------------------
  const diffFromLastMonth = useMemo(() => {
    if (!isSelectionComplete) return 0;

    const hasPreviousData = previousSummary.totalValue > 0;
    if (!hasPreviousData) return 0;

    return getDiffFromLastMonth(currentSummary, previousSummary);
  }, [currentSummary, previousSummary, isSelectionComplete]);

  // ------------------------------
  // 🔹 Resumo por tipo de conta (água, luz, etc.)
  // ------------------------------
  const accountTypeSummary = useMemo(() => {
    const allTypes = Array.from(new Set(accounts.map((a) => a.accountType)));

    // Sem seleção → tudo zero
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

  // ------------------------------
  // 🔹 Resumo dos 12 meses do ano escolhido
  // ------------------------------
  const monthSummaries = useMemo(() => {
    // Sem seleção → devolve placeholders vazios
    if (!isSelectionComplete) {
      return Array.from({ length: 12 }, (_, i) => ({
        month: `${String(i + 1).padStart(2, "0")}/${new Date().getFullYear()}`,
        summary: emptySummary,
      }));
    }

    // Busca meses reais daquele ano
    const months = getMonthsByYear(accounts, selectedYear);

    return months.map((m) => ({
      month: m,
      summary: computeMonthSummary(
        accounts.filter((acc) => acc.month === m),
        m
      ),
    }));
  }, [accounts, selectedYear, isSelectionComplete]);

  // ============================================================
  // 🔙 Retorna tudo para ser usado nos componentes
  // ============================================================
  return {
    selectedYear,
    selectedMonth,
    selectedType,
    selectedPaid,

    setSelectedYear,
    setSelectedMonth,
    setSelectedType,
    setSelectedPaid,

    availableYears,
    availableMonths,
    availableTypes,
    availablePaids,

    filteredAccounts,

    // Exclusivo da Home
    accountsForSelectedMonth,
    currentSummary,
    diffFromLastMonth,
    accountTypeSummary,
    monthSummaries,
  };
}
