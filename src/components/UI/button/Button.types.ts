import type { ReactNode } from "react";

export interface ButtonProps {
  text?: string | ReactNode;
  icon?: ButtonIconKey;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "full" | "auto" | string | number;
  variant?: "solid" | "border";
  onClick?: () => void;
}

export type ButtonIconKey = "logout" | "email" | "settings";
