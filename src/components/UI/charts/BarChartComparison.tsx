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
import { defaultChartFont } from "./Chart.config";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useThemeColors } from "./hook/useThemeColors";
import { useTheme } from "@/providers/hook/useTheme";

/**
 * CustomBarChart
 * ------------------------------------------------------------
 * Componente de gráfico de barras personalizável para exibir
 * valores "Paid" e "Unpaid" por mês.
 *
 * Principais funcionalidades:
 * - Responsivo: muda layout horizontal/vertical conforme tela.
 * - Gradientes e cores configuráveis.
 * - Formatação de valores monetários.
 * - Mensagem de "No data available" quando não há dados.
 */
export const CustomBarChart = ({
  data,
  title = "",
  height = 500,
  font = defaultChartFont,
}: CustomBarChartProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { theme } = useTheme();
  const themeColors = useThemeColors();
  const colors = {
    paid: themeColors.barsPaid,
    unpaid: themeColors.barsUnpaid,
    grid: themeColors.shadow,
    text: themeColors.text,
    bg: themeColors.background,
  };

  // Ordena e normaliza os dados para renderização
  const sortedData = useMemo(() => {
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

  // Verifica se há algum valor relevante (Paid ou Unpaid)
  const hasAnyValue = sortedData.some((d) => d.Paid > 0 || d.Unpaid > 0);

  // Formata eixo Y com abreviação monetária (R$ 1k, R$ 1M, etc)
  function formatYAxisAbbr(value: number) {
    if (value >= 1_000_000) return `R$ ${Math.round(value / 1_000_000)}M`;
    if (value >= 1_000) return `R$ ${Math.round(value / 1_000)}k`;
    return `R$ ${Math.round(value)}`;
  }

  return (
    <div className="bg-bgComponents rounded-lg border-2 border-primary p-6 flex flex-col gap-4">
      {title && <Title text={title} size="xl" />}

      {/* Caso não haja valores, mostra mensagem centralizada */}
      {!hasAnyValue ? (
        <div className="flex justify-center items-center text-textColorHeader text-xl italic font-lato">
          No data available
        </div>
      ) : (
        <ResponsiveContainer key={theme} width="100%" height={height}>
          <BarChart
            data={sortedData}
            layout={isMobile ? "vertical" : "horizontal"} // layout responsivo
            barGap={4}
            barCategoryGap={isMobile ? 20 : 10}
          >
            {/* Gradientes para Paid e Unpaid */}
            <defs>
              <linearGradient
                id="paidGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="0"
              >
                <stop offset="0%" stopColor={colors.paid} />
                <stop offset="100%" stopColor={colors.paid} />
              </linearGradient>
              <linearGradient
                id="unpaidGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="0"
              >
                <stop offset="0%" stopColor={colors.unpaid} />
                <stop offset="100%" stopColor={colors.unpaid} />
              </linearGradient>
            </defs>

            {/* Grid horizontal e vertical */}
            <CartesianGrid stroke={colors.grid} vertical={false} />

            {/* Eixos X e Y responsivos */}
            {isMobile ? (
              <>
                <YAxis
                  type="category"
                  dataKey="month"
                  stroke={colors.paid}
                  tick={{
                    fill: colors.text,
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
                    fill: colors.text,
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
                    fill: colors.text,
                    fontFamily: font.family,
                    fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                  }}
                  tickLine={false}
                  axisLine={{ stroke: colors.paid, strokeWidth: 2 }}
                />
                <YAxis
                  stroke={colors.paid}
                  tick={{
                    fill: colors.text,
                    fontFamily: font.family,
                    fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                  }}
                  tickFormatter={formatYAxisAbbr}
                  tickLine={false}
                  axisLine={{ stroke: colors.paid, strokeWidth: 2 }}
                />
              </>
            )}

            {/* Tooltip customizado */}
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              content={({ payload, label }) => {
                if (!payload || payload.length === 0) return null;
                return (
                  <div
                    style={{
                      backgroundColor: colors.bg,
                      border: `2px solid ${colors.paid}`,
                      borderRadius: "16px",
                      padding: "16px",
                      fontFamily: font.family,
                      fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
                      color: colors.text,
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

            {/* Legenda */}
            <Legend
              wrapperStyle={{
                color: colors.text,
                fontFamily: font.family,
                fontSize: isMobile ? font.sizeMobile : font.sizeDesktop,
              }}
              iconType="circle"
            />

            {/* Barras Paid */}
            <Bar
              dataKey="Paid"
              name="Paid"
              stackId="a"
              fill="url(#paidGradient)"
              radius={[0, 0, 0, 0]}
              label={
                isMobile
                  ? false
                  : {
                      position: "top",
                      fill: colors.text,
                      fontSize: font.sizeDesktop,
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
                    }
              }
              barSize={isMobile ? 20 : undefined}
            />

            {/* Barras Unpaid */}
            <Bar
              dataKey="Unpaid"
              name="Unpaid"
              stackId="a"
              fill="url(#unpaidGradient)"
              radius={[0, 0, 0, 0]}
              label={{
                position: isMobile ? "right" : "top",
                fill: colors.text,
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
      )}
    </div>
  );
};
