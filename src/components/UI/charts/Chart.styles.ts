import type { ChartFontStyle } from "./Chart.types";

export const createTickStyle = (font: ChartFontStyle) => ({
  fill: font.color,
  fontFamily: font.family,
  fontWeight: font.weight,
});
