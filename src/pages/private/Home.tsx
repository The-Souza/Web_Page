import { useAuth } from "@/providers/hook/useAuth";
import { useAccounts } from "@/hooks/useAccounts";
import { Card, Title, Table, Select, CustomBarChart } from "@/components";
import { useAccountSummary } from "@/hooks/useAccountSummary";
import { formatCurrency } from "@/helpers/accountHelpers";
import type { Account } from "@/types/account.types";
import { ACCOUNT_TYPE_ICONS } from "@/components/UI/card/Card.variants";
import { useRef, useEffect } from "react";
import type { SelectHandle } from "@/components/UI/select/Select.types";
import { useLoading } from "@/providers/hook/useLoading";
import { ACCOUNT_TYPES, COLORS } from "@/types/homeCards.variants";

export default function Home() {
  const { user } = useAuth();
  const { accounts, loading, updatePaid } = useAccounts(user?.email);
  const summary = useAccountSummary(accounts);
  const monthSelectRef = useRef<SelectHandle | null>(null);
  const { setLoading } = useLoading();

  const chartData = summary.monthSummaries
    .map(({ month, summary }) => ({
      month,
      Paid: Number(summary.paidValue.toFixed(2)),
      Unpaid: Number(summary.unpaidValue.toFixed(2)),
    }))
    // ✅ Filtra meses sem nenhum valor relevante
    .filter((m) => m.Paid > 0 || m.Unpaid > 0);

  const renderDiff = (diff: number) => {
    let color = COLORS.positive;
    let sign = "";

    if (diff > 0) {
      // Pagou mais → vermelho
      color = COLORS.negative;
      sign = "+";
    } else if (diff < 0) {
      // Pagou menos → verde
      color = COLORS.positive;
      sign = "-";
    } else {
      // Sem diferença → neutro
      color = "text-white";
    }

    return (
      <span className={`font-lato font-bold text-lg tracking-tight ${color}`}>
        {sign}
        {formatCurrency(Math.abs(diff))}
      </span>
    );
  };

  useEffect(() => {
    setLoading(loading, loading ? "Loading..." : undefined);
  }, [loading, setLoading]);

  return (
    <div className="flex flex-col gap-4 text-greenLight">
      {!loading && (
        <>
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <Title text="Account Summary" size="2xl" />

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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

          <CustomBarChart data={chartData} title="Comparison by month" />
          <Table<Account>
            data={summary.accountsForSelectedMonth}
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
                    onChange={(e) =>
                      updatePaid(
                        acc.id,
                        e.target.checked,
                        acc.accountType,
                        acc.address
                      )
                    }
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
