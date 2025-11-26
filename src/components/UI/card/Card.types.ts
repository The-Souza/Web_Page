import type { ReactNode } from "react";

export interface CardProps {
  title: string;
  value?: string | number | ReactNode;
  emptyPlaceholder?: string;
  icon?: CardIconKey | ReactNode;
  className?: string;
}

export type CardIconKey = "money" | "water" | "gas" | "internet" | "energy";
