import type { ChartColorScheme, ChartFontStyle } from "./Chart.types";

/**
 * defaultChartColors
 * ------------------------------------------------------------
 * Cores padrão utilizadas nos gráficos de barras.
 *
 * Propriedades:
 * - paid: cor para barras de valores pagos.
 * - unpaid: cor para barras de valores não pagos.
 * - grid: cor das linhas de grade do gráfico.
 * - background: cor de fundo do contêiner do gráfico.
 */
export const defaultChartColors: ChartColorScheme = {
  paid: "#00ff9f",
  unpaid: "#ff4444",
  grid: "rgba(255, 255, 255, 0.1)",
  background: "#0a0a0a",
};

/**
 * defaultChartFont
 * ------------------------------------------------------------
 * Estilo de fonte padrão usado nos textos do gráfico (ticks, legendas, tooltips).
 *
 * Propriedades:
 * - family: família de fonte.
 * - sizeDesktop: tamanho da fonte em desktops.
 * - sizeMobile: tamanho da fonte em dispositivos móveis.
 * - color: cor do texto.
 * - weight: peso da fonte (boldness).
 */
export const defaultChartFont: ChartFontStyle = {
  family: "Lato, sans-serif",
  sizeDesktop: 16,
  sizeMobile: 14,
  color: "#FFFFFF",
  weight: 600,
};
