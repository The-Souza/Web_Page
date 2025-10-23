import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Title } from "@/components";
import type { CustomBarChartProps } from "./Chart.types";
import { defaultChartColors, defaultChartFont } from "./Chart.config";
import { useMediaQuery } from "@/hooks/UseMediaQuery";
import { useMemo } from "react";
import type { ReactNode } from "react";

export const CustomBarChart = ({
  data,
  title = "",
  height = 500,
  colors = defaultChartColors,
  font = defaultChartFont,
}: CustomBarChartProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sortedData = useMemo(() => {
    // Normaliza os valores para 2 casas decimais e ordena por mês
    return [...data]
      .map((d) => ({
        ...d,
        Paid: Number(d.Paid.toFixed(2)),
        Unpaid: Number(d.Unpaid.toFixed(2)),
      }))
      .sort((a, b) => {
        const monthA = Number(a.month.split("/")[0]);
        const monthB = Number(b.month.split("/")[0]);
        return monthA - monthB;
      });
  }, [data]);

  function formatYAxisAbbr(value: number) {
    if (value >= 1_000_000) return `R$ ${Math.round(value / 1_000_000)}M`;
    if (value >= 1_000) return `R$ ${Math.round(value / 1_000)}k`;
    return `R$ ${Math.round(value)}`;
  }

  return (
    <div
      className="bg-dark shadow-greenLight rounded-2xl border-2 border-greenLight p-6 flex flex-col gap-4"
      style={{ backgroundColor: colors.background }}
    >
      {title && <Title text={title} size="xl" />}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sortedData}
          layout={isMobile ? "vertical" : "horizontal"}
          barGap={4}
          barCategoryGap={isMobile ? 20 : 10}
        >
          <defs>
            <linearGradient
              id="paidGradient"
              x1="0"
              y1="0"
              x2={isMobile ? "1" : "0"}
              y2={isMobile ? "0" : "1"}
            >
              <stop offset="0%" stopColor={colors.paid} stopOpacity={0.8} />
              <stop offset="100%" stopColor={colors.paid} stopOpacity={0.3} />
            </linearGradient>
            <linearGradient
              id="unpaidGradient"
              x1="0"
              y1="0"
              x2={isMobile ? "1" : "0"}
              y2={isMobile ? "0" : "1"}
            >
              <stop offset="0%" stopColor={colors.unpaid} stopOpacity={0.8} />
              <stop offset="100%" stopColor={colors.unpaid} stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={colors.grid} vertical={false} />

          {isMobile ? (
            <>
              <YAxis
                type="category"
                dataKey="month"
                stroke={colors.paid}
                tick={{
                  fill: font.color,
                  fontFamily: font.family,
                  fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                }}
                axisLine={{ stroke: colors.paid, strokeWidth: 2 }}
                tickLine={false}
              />
              <XAxis
                type="number"
                stroke={colors.paid}
                tick={{
                  fill: font.color,
                  fontFamily: font.family,
                  fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                }}
                tickFormatter={formatYAxisAbbr}
                axisLine={{ stroke: colors.paid, strokeWidth: 2 }}
                tickLine={false}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="month"
                stroke={colors.paid}
                tick={{
                  fill: font.color,
                  fontFamily: font.family,
                  fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                }}
                tickLine={false}
                axisLine={{ stroke: colors.paid, strokeWidth: 2 }}
              />
              <YAxis
                stroke={colors.paid}
                tick={{
                  fill: font.color,
                  fontFamily: font.family,
                  fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                }}
                tickFormatter={formatYAxisAbbr}
                tickLine={false}
                axisLine={{ stroke: colors.paid, strokeWidth: 2 }}
              />
            </>
          )}

          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            content={({ payload, label }) => {
              if (!payload || payload.length === 0) return null;
              return (
                <div
                  style={{
                    backgroundColor: "#1c1c1c",
                    border: `2px solid ${colors.paid}`,
                    borderRadius: "16px",
                    padding: "16px",
                    fontFamily: font.family,
                    fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                    color: font.color,
                  }}
                >
                  <div>{label}</div>
                  {payload.map((entry, index) => {
                    const color =
                      entry.dataKey === "Paid" ? colors.paid : colors.unpaid;
                    return (
                      <div
                        key={index}
                        style={{
                          color,
                          fontSize: isMobile
                            ? font.sizeMobile
                            : font.sizeDesktop,
                          fontFamily: font.family,
                        }}
                      >
                        {entry.name}: R${" "}
                        {Number(entry.value).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />

          <Legend
            wrapperStyle={{
              color: font.color,
              fontFamily: font.family,
              fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
            }}
            iconType="circle"
          />

          <Bar
            dataKey="Paid"
            name="Paid"
            stackId="a"
            fill="url(#paidGradient)"
            radius={isMobile ? [0, 8, 8, 0] : [8, 8, 0, 0]}
            label={{
              position: isMobile ? "right" : "top",
              fill: font.color,
              fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
              fontFamily: font.family,
              formatter: (label: ReactNode) => {
                const n = Number(label as number);
                return !isNaN(n)
                  ? n.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : label;
              },
            }}
            barSize={isMobile ? 20 : undefined}
          />
          <Bar
            dataKey="Unpaid"
            name="Unpaid"
            stackId="a"
            fill="url(#unpaidGradient)"
            radius={isMobile ? [0, 8, 8, 0] : [8, 8, 0, 0]}
            label={{
              position: isMobile ? "right" : "top",
              fill: font.color,
              fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
              fontFamily: font.family,
              formatter: (label: ReactNode) => {
                const n = Number(label as number);
                return !isNaN(n)
                  ? n.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : label;
              },
            }}
            barSize={isMobile ? 20 : undefined}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
