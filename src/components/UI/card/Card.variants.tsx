import type { ReactNode } from "react";
import type { CardIconKey } from "./Card.types";

/**
 * CARD_ICONS
 * ------------------------------------------------------------
 * Mapeamento de chaves (CardIconKey) para funções que retornam ícones JSX.
 * Usado no componente Card para renderizar ícones pré-definidos.
 */
export const CARD_ICONS: Record<CardIconKey, () => ReactNode> = {
  money: () => <i className="fa-solid fa-dollar-sign fa-lg text-current" />, // ícone de dinheiro
  water: () => <i className="fa-solid fa-droplet fa-lg text-current" />,      // ícone de água
  gas: () => <i className="fa-solid fa-fire-flame-simple fa-lg text-current" />, // ícone de gás
  internet: () => <i className="fa-solid fa-wifi fa-lg text-current" />,      // ícone de internet
  energy: () => <i className="fa-solid fa-bolt fa-lg text-current" />,       // ícone de energia
};

/**
 * ACCOUNT_TYPE_ICONS
 * ------------------------------------------------------------
 * Mapeamento de tipos de contas para chaves de CARD_ICONS.
 * Permite converter nomes de contas em ícones correspondentes.
 */
export const ACCOUNT_TYPE_ICONS: Record<string, CardIconKey> = {
  Water: "water",
  Gas: "gas",
  Internet: "internet",
  Energy: "energy",
  Money: "money",
};
