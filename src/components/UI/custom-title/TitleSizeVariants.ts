import type { TitleProps } from "./Title.types";

// 'NonNullable' remove o undefined
export type TitleSize = NonNullable<TitleProps["size"]>;

export const TITLE_SIZE_VARIANTS: Record<TitleSize, string> = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};
