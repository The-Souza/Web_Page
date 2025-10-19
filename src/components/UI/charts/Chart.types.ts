export interface ChartColorScheme {
  paid: string;
  unpaid: string;
  grid: string;
  background: string;
}

export interface ChartFontStyle {
  family: string;
  sizeDesktop: number;
  sizeMobile: number;
  color: string;
  weight: number;
}

export interface CustomBarChartProps {
  data: { month: string; Paid: number; Unpaid: number }[];
  title?: string;
  height?: number;
  colors?: ChartColorScheme;
  font?: ChartFontStyle;
}
