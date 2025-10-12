import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { useAccounts } from "@/hooks/useAccounts";
import {
  getPreviousMonth,
  calculateMonthSummary,
  calculateAccountTypeSummary,
  formatCurrency,
  getDiffFromLastMonth,
  emptySummary,
  getAvailableYears,
  getMonthsByYear,
} from "@/helpers/accountHelpers";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Title, Table, Select } from "@/components";

import type { Account } from "@/models/account.types";
import { ACCOUNT_TYPE_ICONS } from "@/components/UI/card/Card.variants";

const COLORS = {
  paid: "#00ff9f",
  unpaid: "#ff4444",
  positive: "text-greenLight",
  negative: "text-red-500",
};

export default function Home() {
  const { user } = useAuth();
  const { accounts, loading, updatePaid } = useAccounts(user?.email);

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    setSelectedYear(year);
    setSelectedMonth(`${month}/${year}`);
  }, []);

  const availableYears = useMemo(() => getAvailableYears(accounts), [accounts]);
  const availableMonths = useMemo(
    () => getMonthsByYear(accounts, selectedYear),
    [accounts, selectedYear]
  );
  const accountsForSelectedMonth = useMemo(
    () => accounts.filter((acc) => acc.month === selectedMonth),
    [accounts, selectedMonth]
  );
  const previousMonth = useMemo(
    () => (selectedMonth ? getPreviousMonth(selectedMonth) : ""),
    [selectedMonth]
  );

  const currentSummary = useMemo(
    () =>
      selectedMonth && accountsForSelectedMonth.length > 0
        ? calculateMonthSummary(accountsForSelectedMonth, selectedMonth)
        : emptySummary,
    [accountsForSelectedMonth, selectedMonth]
  );

  const previousSummary = useMemo(
    () =>
      previousMonth && accountsForSelectedMonth.length > 0
        ? calculateMonthSummary(accounts, previousMonth)
        : emptySummary,
    [accounts, previousMonth, accountsForSelectedMonth.length]
  );

  const diffFromLastMonth = useMemo(
    () => getDiffFromLastMonth(currentSummary, previousSummary),
    [currentSummary, previousSummary]
  );

  const accountTypeSummary = useMemo(() => {
    if (!selectedMonth || accountsForSelectedMonth.length === 0) {
      const allTypes = Array.from(new Set(accounts.map((a) => a.accountType)));
      return allTypes.map((type) => ({
        type,
        totalValue: 0,
        paidValue: 0,
        unpaidValue: 0,
      }));
    }
    return calculateAccountTypeSummary(accountsForSelectedMonth, selectedMonth);
  }, [accountsForSelectedMonth, selectedMonth, accounts]);

  const monthSummaries = useMemo(
    () =>
      availableMonths.map((m) => ({
        month: m,
        summary: calculateMonthSummary(
          accounts.filter((acc) => acc.month === m),
          m
        ),
      })),
    [accounts, availableMonths]
  );

  const chartData = useMemo(
    () =>
      monthSummaries.map(({ month, summary }) => ({
        month,
        Paid: summary.paidValue,
        Unpaid: summary.unpaidValue,
      })),
    [monthSummaries]
  );

  const renderDiff = (diff: number) => {
    const color = diff <= 0 ? COLORS.positive : COLORS.negative;
    const sign = diff >= 0 ? "+" : "-";
    return (
      <span className={`font-lato font-bold text-lg tracking-tight ${color}`}>
        {sign}
        {formatCurrency(Math.abs(diff))}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-4 text-greenLight">
      {loading && (
        <p className="text-greenLight items-center justify-center font-raleway">
          Carregando...
        </p>
      )}

      {!loading && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <Title text="Resumo de Contas" size="2xl" />

            <div className="flex gap-2 w-full sm:w-auto">
              <Select
                label="Yaer"
                options={availableYears.map((y) => ({ label: y, value: y }))}
                placeholder="Select a year"
                defaultValue={selectedYear}
                onChange={(val) => {
                  setSelectedYear(val);
                  const months = getMonthsByYear(accounts, val);
                  setSelectedMonth(months.length > 0 ? months[0] : "");
                }}
              />

              <Select
                label="Month"
                options={availableMonths.map((m) => ({ label: m, value: m }))}
                placeholder="Select a month"
                defaultValue={selectedMonth}
                onChange={(val) => setSelectedMonth(val)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card
              title="Total for the month"
              icon="money"
              value={formatCurrency(currentSummary.totalValue)}
            />
            <Card
              title="Paid"
              icon="money"
              value={formatCurrency(currentSummary.paidValue)}
            />
            <Card
              title="Previous month"
              icon="money"
              value={renderDiff(diffFromLastMonth)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
            {accountTypeSummary.map(
              ({ type, totalValue, paidValue, unpaidValue }) => (
                <Card
                  key={type}
                  title={type}
                  icon={ACCOUNT_TYPE_ICONS[type] || "money"}
                  value={
                    <>
                      <p>Total: {formatCurrency(totalValue)}</p>
                      <p>Paid: {formatCurrency(paidValue)}</p>
                      <p className="text-red-400">
                        Missing: {formatCurrency(unpaidValue)}
                      </p>
                    </>
                  }
                />
              )
            )}
          </div>

          <div className="bg-dark shadow-greenLight rounded-xl border-2 border-greenLight p-6 flex flex-col gap-2">
            <Title text="Comparison by month" size="xl"></Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke={COLORS.paid} />
                <YAxis stroke={COLORS.paid} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Paid" stackId="a" fill={COLORS.paid} />
                <Bar dataKey="Unpaid" stackId="a" fill={COLORS.unpaid} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Table<Account>
            data={accountsForSelectedMonth}
            rowKey={(acc) => acc.id}
            columns={[
              { key: "accountType", label: "Account" },
              { key: "address", label: "Address" },
              {
                key: "value",
                label: "Value (R$)",
                render: (val) => formatCurrency(val as number),
              },
              {
                key: "paid",
                label: "Paid/Unpaid",
                render: (val, acc) => (
                  <input
                    type="checkbox"
                    checked={!!val}
                    onChange={(e) => updatePaid(acc.id, e.target.checked)}
                    className="accent-greenLight"
                  />
                ),
              },
            ]}
            emptyMessage="No accounts for this month"
          />
        </>
      )}
    </div>
  );
}
