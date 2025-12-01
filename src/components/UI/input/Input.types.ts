import type { InputHTMLAttributes, ChangeEvent } from "react";

/**
 * InputProps
 * ------------------------------------------------------------
 * Define as propriedades aceitas pelo componente Input.
 * Estende as props padrão de <input>, exceto "onChange", que é redefinida.
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  
  /** Texto do label que aparece acima do input */
  label?: string;

  /** Mensagem de erro exibida abaixo do input */
  error?: string;

  /** Função chamada ao alterar o valor do input */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;

  /** Tema do input: claro ou escuro (afeta cores de background, texto e placeholder) */
  theme?: "light" | "dark";
}
