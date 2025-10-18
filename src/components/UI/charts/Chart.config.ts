import type { ChartColorScheme, ChartFontStyle } from "./Chart.types";

export const defaultChartColors: ChartColorScheme = {
  paid: "#00ff9f",
  unpaid: "#ff4444",
  grid: "rgba(255, 255, 255, 0.1)",
  background: "#0a0a0a",
};

export const defaultChartFont: ChartFontStyle = {
  family: "Lato, sans-serif",
  sizeDesktop: 16,
  sizeMobile: 14,
  color: "#FFFFFF",
  weight: 600,
};
