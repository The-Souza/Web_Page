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

export function useAccountSummary(accounts: Account[]) {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const availableYears = useMemo(() => getAvailableYears(accounts), [accounts]);

  const availableMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getMonthsByYear(accounts, selectedYear);
  }, [accounts, selectedYear]);

  const isSelectionComplete = !!selectedYear && !!selectedMonth;

  const accountsForSelectedMonth = useMemo(() => {
    if (!isSelectionComplete) return [];
    return accounts.filter((acc) => acc.month === selectedMonth);
  }, [accounts, selectedMonth, isSelectionComplete]);

  const previousMonth = useMemo(() => {
    if (!isSelectionComplete) return "";
    return getPreviousMonth(selectedMonth);
  }, [selectedMonth, isSelectionComplete]);

  const currentSummary = useMemo(() => {
    if (!isSelectionComplete || accountsForSelectedMonth.length === 0)
      return emptySummary;
    return computeMonthSummary(accountsForSelectedMonth, selectedMonth);
  }, [accountsForSelectedMonth, selectedMonth, isSelectionComplete]);

  const previousSummary = useMemo(() => {
    if (!isSelectionComplete || !previousMonth) return emptySummary;
    return computeMonthSummary(accounts, previousMonth);
  }, [accounts, previousMonth, isSelectionComplete]);

  const diffFromLastMonth = useMemo(() => {
    if (!isSelectionComplete) return 0;
    return getDiffFromLastMonth(currentSummary, previousSummary);
  }, [currentSummary, previousSummary, isSelectionComplete]);

  const accountTypeSummary = useMemo(() => {
    const allTypes = Array.from(new Set(accounts.map((a) => a.accountType)));

    if (!isSelectionComplete)
      return allTypes.map((type) => ({
        type,
        totalValue: 0,
        paidValue: 0,
        unpaidValue: 0,
      }));

    if (accountsForSelectedMonth.length === 0)
      return allTypes.map((type) => ({
        type,
        totalValue: 0,
        paidValue: 0,
        unpaidValue: 0,
      }));

    return computeAccountTypeSummary(accountsForSelectedMonth, selectedMonth);
  }, [accountsForSelectedMonth, selectedMonth, isSelectionComplete, accounts]);

  const monthSummaries = useMemo(() => {
    if (!isSelectionComplete)
      return Array.from({ length: 12 }, (_, i) => ({
        month: `${String(i + 1).padStart(2, "0")}/${new Date().getFullYear()}`,
        summary: emptySummary,
      }));

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
