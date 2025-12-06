import type { ReactNode } from "react";

/**
 * ButtonProps
 * ------------------------------------------------------------
 * Define as propriedades aceitas pelo componente Button.
 * Comentários inline explicam cada campo.
 */
export interface ButtonProps {
  text?: string | ReactNode; // Texto do botão ou elemento JSX customizado
  icon?: ButtonIconKey;       // Chave do ícone, relacionada a BUTTON_ICONS
  disabled?: boolean;         // Se true, desabilita o botão e aplica estilos
  type?: "button" | "submit" | "reset"; // Tipo HTML do botão
  size?: "full" | "auto" | string | number; 
  // "full": 100% do container
  // "auto": largura mínima para o conteúdo
  // string: qualquer classe CSS/Tailwind válida
  // number: largura fixa em rem
  variant?: "solid" | "border" | "bottomless" | "unpaid"; 
  // "solid": fundo colorido com texto claro
  // "border": transparente com borda colorida
  // "bottomless": estilo link, sem fundo nem borda
  onClick?: () => void; // Função chamada ao clicar
}

/**
 * ButtonIconKey
 * ------------------------------------------------------------
 * Tipos de ícones suportados. Cada chave mapeia para uma função
 * em BUTTON_ICONS que retorna JSX do ícone correspondente.
 */
export type ButtonIconKey = "logout" | "email" | "settings" | "money" | "trash" | "edit";
