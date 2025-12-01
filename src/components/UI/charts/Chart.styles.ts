import type { ChartFontStyle } from "./Chart.types";

/**
 * createTickStyle
 * ------------------------------------------------------------
 * Função utilitária que cria o estilo para os ticks (rótulos) do eixo
 * dos gráficos, a partir de um objeto ChartFontStyle.
 *
 * Parâmetros:
 * - font: ChartFontStyle → contém família, cor e peso da fonte.
 *
 * Retorno:
 * - Objeto com as propriedades CSS necessárias para aplicar ao tick:
 *   - fill: cor do texto.
 *   - fontFamily: família da fonte.
 *   - fontWeight: peso da fonte.
 */
export const createTickStyle = (font: ChartFontStyle) => ({
  fill: font.color,        // define a cor do tick
  fontFamily: font.family, // define a família da fonte
  fontWeight: font.weight, // define o peso da fonte (boldness)
});
