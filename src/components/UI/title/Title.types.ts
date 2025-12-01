export interface TitleProps {
  /** Texto a ser exibido no título. Se não fornecido, usa valor padrão do componente. */
  text?: string;

  /** Tamanho do título. Aceita variantes predefinidas do componente */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}
