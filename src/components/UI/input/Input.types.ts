import type { InputHTMLAttributes, ChangeEvent } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  theme?: "light" | "dark";
}
