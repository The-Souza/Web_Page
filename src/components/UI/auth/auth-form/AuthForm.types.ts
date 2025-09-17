import type { ReactNode } from "react";

export interface AuthFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}