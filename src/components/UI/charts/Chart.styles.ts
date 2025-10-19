import type { ChartFontStyle } from "./Chart.types";

export const createTickStyle = (font: ChartFontStyle) => ({
  fill: font.color,
  fontSize: font.size,
  fontFamily: font.family,
  fontWeight: font.weight,
});
