/**
 * ChartColorScheme
 * ------------------------------------------------------------
 * Define o esquema de cores utilizado nos gráficos.
 * - paid: cor das barras de valores pagos.
 * - unpaid: cor das barras de valores não pagos.
 * - grid: cor das linhas do grid do gráfico.
 */
export interface ChartColorScheme {
  paid: string;
  unpaid: string;
  grid: string;
}

/**
 * ChartFontStyle
 * ------------------------------------------------------------
 * Define o estilo da fonte utilizada nos textos do gráfico.
 * - family: família da fonte (ex: "Lato, sans-serif").
 * - sizeDesktop: tamanho da fonte para desktop.
 * - sizeMobile: tamanho da fonte para mobile.
 * - color: cor do texto.
 * - weight: peso da fonte (ex: 400, 600, etc).
 */
export interface ChartFontStyle {
  family: string;
  sizeDesktop: number;
  sizeMobile: number;
  color: string;
  weight: number;
}

/**
 * CustomBarChartProps
 * ------------------------------------------------------------
 * Define as propriedades aceitas pelo componente CustomBarChart.
 * - data: array de objetos com mês, valores pagos e não pagos.
 * - title?: título do gráfico.
 * - height?: altura do gráfico em pixels.
 * - colors?: esquema de cores personalizado (ChartColorScheme).
 * - font?: estilo de fonte personalizado (ChartFontStyle).
 */
export interface CustomBarChartProps {
  data: { month: string; Paid: number; Unpaid: number }[];
  title?: string;
  height?: number;
  colors?: ChartColorScheme;
  font?: ChartFontStyle;
}
