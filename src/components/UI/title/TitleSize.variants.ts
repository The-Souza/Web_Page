import type { TitleProps } from "./Title.types";

/** 
 * Tipo de tamanho do título, garantindo que não seja nulo ou indefinido
 */
export type TitleSize = NonNullable<TitleProps["size"]>;

/** 
 * Mapeamento das variantes de tamanho para classes Tailwind CSS correspondentes
 */
export const TITLE_SIZE_VARIANTS: Record<TitleSize, string> = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};
