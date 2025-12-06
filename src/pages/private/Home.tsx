import { useAuth } from "@/providers/hook/useAuth";
import { useAccounts } from "@/hooks/useAccounts";
import {
  Card,
  Title,
  Table,
  Select,
  CustomBarChart,
  Button,
} from "@/components";
import { useAccountSummary } from "@/hooks/useAccountSummary";
import { formatConsumption, formatCurrency } from "@/helpers/accountHelpers";
import type { Account } from "@/types/account.types";
import { ACCOUNT_TYPE_ICONS } from "@/components/UI/card/Card.variants";
import { useRef, useEffect } from "react";
import type { SelectHandle } from "@/components/UI/select/Select.types";
import { useLoading } from "@/providers/hook/useLoading";
import { ACCOUNT_TYPES, COLORS } from "@/types/homeCards.variants";

/**
 * Home
 * ------------------------------------------------------------
 * Tela principal do usuário após login, exibindo resumo financeiro e contas.
 * Funcionalidades principais:
 * - Exibe cards de resumo de contas e comparativo mensal.
 * - Permite filtro por ano e mês usando Selects.
 * - Renderiza gráfico de barras customizado (CustomBarChart) para comparação mensal.
 * - Tabela de contas detalhadas com possibilidade de marcar como pago.
 * - Integração com hooks de autenticação, contas, resumo e loading.
 */
export default function Home() {
  const { user } = useAuth(); // Usuário logado
  const { accounts, loading, updatePaid } = useAccounts(user?.email); // Lista de contas e função para marcar pagamento
  const summary = useAccountSummary(accounts); // Resumo das contas (totais, comparativos, filtros)
  const monthSelectRef = useRef<SelectHandle | null>(null); // Ref para controle do Select de meses
  const { setLoading } = useLoading(); // Hook de loading global

  // 🔹 Prepara dados para gráfico de barras comparativo mensal
  const chartData = summary.monthSummaries
    .map(({ month, summary }) => ({
      month,
      Paid: Number(summary.paidValue.toFixed(2)),
      Unpaid: Number(summary.unpaidValue.toFixed(2)),
    }))
    // 🔹 Remove meses sem valores relevantes
    .filter((m) => m.Paid > 0 || m.Unpaid > 0);

  // 🔹 Renderiza diferença do mês anterior com cores e sinais apropriados
  const renderDiff = (diff: number) => {
    let color = COLORS.positive;
    let sign = "";

    if (diff > 0) {
      color = COLORS.negative; // Pagou mais → vermelho
      sign = "+";
    } else if (diff < 0) {
      color = COLORS.positive; // Pagou menos → verde
      sign = "-";
    } else {
      color = "text-white"; // Sem diferença
    }

    return (
      <span className={`font-lato font-bold text-lg tracking-tight ${color}`}>
        {sign}
        {formatCurrency(Math.abs(diff))}
      </span>
    );
  };

  // 🔹 Atualiza estado global de loading conforme carregamento de contas
  useEffect(() => {
    setLoading(loading, loading ? "Loading..." : undefined);
  }, [loading, setLoading]);

  return (
    <div className="flex flex-col gap-4 text-greenLight">
      {!loading && (
        <>
          {/* 🔹 Título e filtros */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <Title text="Account Summary" size="2xl" />

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Select de ano */}
              <Select
                label="Year"
                options={summary.availableYears.map((y) => ({
                  label: y,
                  value: y,
                }))}
                placeholder="Select a year"
                onChange={(val) => {
                  summary.setSelectedYear(val);
                  summary.setSelectedMonth("");
                  monthSelectRef.current?.clear();
                }}
              />

              {/* Select de mês */}
              <Select
                ref={monthSelectRef}
                label="Month"
                options={summary.availableMonths.map((m) => ({
                  label: m,
                  value: m,
                }))}
                placeholder="Select a month"
                onChange={(val) => summary.setSelectedMonth(val)}
              />
            </div>
          </div>

          {/* 🔹 Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              title="Total for the month"
              icon="money"
              value={formatCurrency(summary.currentSummary.totalValue)}
            />
            <Card
              title="Paid"
              icon="money"
              value={formatCurrency(summary.currentSummary.paidValue)}
            />
            <Card
              title="Previous month"
              icon="money"
              value={renderDiff(summary.diffFromLastMonth)}
            />
          </div>

          {/* 🔹 Cards por tipo de conta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {ACCOUNT_TYPES.map((type) => {
              const data = summary.accountTypeSummary.find(
                (item) => item.type === type
              );
              const totalValue = data?.totalValue ?? 0;
              const paidValue = data?.paidValue ?? 0;
              const unpaidValue = data?.unpaidValue ?? 0;

              return (
                <Card
                  key={type}
                  title={type}
                  icon={ACCOUNT_TYPE_ICONS[type] || "money"}
                  value={
                    <>
                      <p>Total: {formatCurrency(totalValue)}</p>
                      <p className={COLORS.positive}>
                        Paid: {formatCurrency(paidValue)}
                      </p>
                      <p className={COLORS.negative}>
                        Missing: {formatCurrency(unpaidValue)}
                      </p>
                    </>
                  }
                />
              );
            })}
          </div>

          {/* 🔹 Gráfico de barras comparativo */}
          <CustomBarChart data={chartData} title="Comparison by month" />

          {/* 🔹 Tabela de contas detalhadas */}
          <Table<Account>
            data={summary.accountsForSelectedMonth}
            rowKey={(acc) => acc.id}
            columns={[
              { key: "address", label: "Address" },
              { key: "accountType", label: "Account" },
              {
                key: "consumption",
                label: "Consumption",
                render: (val, row) =>
                  formatConsumption(row.accountType, val as number),
              },
              { key: "days", label: "Days" },
              {
                key: "value",
                label: "Value (R$)",
                render: (val) => formatCurrency(val as number),
              },
              {
                key: "paid",
                label: "Paid/Unpaid",
                className: "px-4 py-3 flex justify-center items-center",
                render: (value, acc) => (
                  <div className="w-[6rem]">
                    <Button
                      text={value ? "Unpaid" : "Paid"}
                      icon="money"
                      size="full"
                      variant={value ? "unpaid" : "solid"}
                      onClick={() =>
                        updatePaid(
                          acc.id,
                          !value, // inverte o estado
                          acc.accountType,
                          acc.address
                        )
                      }
                    />
                  </div>
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
