import type { ReactNode } from "react";

/**
 * AuthFormProps
 * ------------------------------------------------------------
 * Interface que define as props do componente AuthForm.
 * 
 * Props:
 * - onSubmit: função que será chamada ao submeter o formulário.
 *   Recebe o evento do tipo React.FormEvent<HTMLFormElement>.
 * - children: elementos React que serão renderizados dentro do formulário,
 *   como inputs, botões e outros componentes.
 */
export interface AuthFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}
