import type { ReactNode } from "react";

/**
 * CardProps
 * ------------------------------------------------------------
 * Define as propriedades aceitas pelo componente Card.
 */
export interface CardProps {
  title: string;                // Título exibido no cartão
  value?: string | number | ReactNode; // Valor principal do cartão (texto, número ou JSX)
  emptyPlaceholder?: string;    // Texto exibido quando o valor estiver vazio (default: "--")
  icon?: CardIconKey | ReactNode; // Ícone do cartão: chave de CARD_ICONS ou JSX customizado
  className?: string;           // Classes CSS adicionais para o container
}

/**
 * CardIconKey
 * ------------------------------------------------------------
 * Tipos de ícones pré-definidos suportados pelo componente Card.
 * Cada chave deve corresponder a uma função em CARD_ICONS que retorna JSX do ícone.
 */
export type CardIconKey = "money" | "water" | "gas" | "internet" | "energy";
