import type { InputHTMLAttributes, ChangeEvent } from "react";

export interface Option {
  label: string;
  value: string;
}

export interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  type?: "text" | "password" | "select" | "email";
  options?: Option[];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
