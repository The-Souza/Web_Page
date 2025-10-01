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

  // Define ano e mês atuais no primeiro render
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
      // devolve todos os tipos conhecidos mas zerados
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

  // resumo gráfico só do ano selecionado
  const monthSummaries = useMemo(() => {
    return availableMonths.map((m) => ({
      month: m,
      summary: calculateMonthSummary(
        accounts.filter((acc) => acc.month === m),
        m
      ),
    }));
  }, [accounts, availableMonths]);

  const chartData = useMemo(
    () =>
      monthSummaries.map(({ month, summary }) => ({
        month,
        Pago: summary.paidValue,
        "Não Pago": summary.unpaidValue,
      })),
    [monthSummaries]
  );

  const renderDiff = (diff: number) => {
    const color = diff <= 0 ? COLORS.positive : COLORS.negative;
    const sign = diff >= 0 ? "+" : "-";
    return (
      <p className={`text-2xl font-bold ${color}`}>
        {sign}
        {formatCurrency(Math.abs(diff))}
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-4 text-greenLight font-raleway">
      {loading && <p className="text-greenLight font-raleway">Carregando...</p>}
      {!loading && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">Resumo de Contas</h1>
            <div className="flex gap-2">
              <select
                className="bg-dark border border-greenLight rounded p-2 text-greenLight"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  const months = getMonthsByYear(accounts, e.target.value);
                  if (months.length > 0) setSelectedMonth(months[0]);
                  else setSelectedMonth("");
                }}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                className="bg-dark border border-greenLight rounded p-2 text-greenLight"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-dark shadow-greenLight p-4 rounded-lg flex-1">
              <h2 className="font-semibold">Total do mês</h2>
              <p className="text-2xl font-bold">
                {formatCurrency(currentSummary.totalValue)}
              </p>
            </div>

            <div className="bg-dark shadow-greenLight p-4 rounded-lg flex-1">
              <h2 className="font-semibold">Pago</h2>
              <p className="text-2xl font-bold">
                {formatCurrency(currentSummary.paidValue)}
              </p>
            </div>

            <div className="bg-dark shadow-greenLight p-4 rounded-lg flex-1">
              <h2 className="font-semibold">Diferença mês anterior</h2>
              {renderDiff(diffFromLastMonth)}
            </div>
          </div>

          {/* Cards por tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
            {accountTypeSummary.map(
              ({ type, totalValue, paidValue, unpaidValue }) => (
                <div
                  key={type}
                  className="bg-dark shadow-greenLight p-4 rounded-lg flex flex-col"
                >
                  <h2 className="font-semibold mb-2">{type}</h2>
                  <p>Total: {formatCurrency(totalValue)}</p>
                  <p>Pago: {formatCurrency(paidValue)}</p>
                  <p className="text-red-400">
                    Faltando: {formatCurrency(unpaidValue)}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Gráfico */}
          <div className="bg-dark shadow-greenLight rounded-lg p-4">
            <h2 className="font-semibold mb-2">Comparativo por mês</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke={COLORS.paid} />
                <YAxis stroke={COLORS.paid} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Pago" stackId="a" fill={COLORS.paid} />
                <Bar dataKey="Não Pago" stackId="a" fill={COLORS.unpaid} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-dark shadow-greenLight rounded-lg">
              <thead className="bg-greenDark text-greenLight">
                <tr>
                  <th className="px-4 py-2">Conta</th>
                  <th className="px-4 py-2">Endereço</th>
                  <th className="px-4 py-2">Valor (R$)</th>
                  <th className="px-4 py-2">Pago</th>
                </tr>
              </thead>
              <tbody>
                {(selectedMonth ? accountsForSelectedMonth : []).map((acc) => (
                  <tr key={acc.id} className="border-b border-greenMid">
                    <td className="px-4 py-2">{acc.accountType}</td>
                    <td className="px-4 py-2">{acc.address}</td>
                    <td className="px-4 py-2">{formatCurrency(acc.value)}</td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={acc.paid}
                        onChange={(e) => updatePaid(acc.id, e.target.checked)}
                        className="accent-greenLight"
                      />
                    </td>
                  </tr>
                ))}
                {selectedMonth && accountsForSelectedMonth.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-greenLight">
                      Nenhuma conta para este mês.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
