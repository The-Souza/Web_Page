import type { ReactNode } from "react";
import type { ButtonIconKey } from "./Button.types";

/**
 * BUTTON_ICONS
 * ------------------------------------------------------------
 * Mapeamento de chaves de ícones para funções que retornam JSX de ícones.
 * Usado pelo componente Button para renderizar ícones conforme a prop `icon`.
 *
 * Estrutura:
 * - A chave é do tipo ButtonIconKey ("logout" | "email" | "settings").
 * - O valor é uma função que retorna um ReactNode (JSX do ícone correspondente).
 *
 * Ícones:
 * - logout: seta saindo de um portal (fa-arrow-right-from-bracket).
 * - email: envelope de mensagem (fa-envelope).
 * - settings: engrenagem de configurações (fa-gear).
 *
 * Observações:
 * - Todos os ícones usam classes do Font Awesome e herdam a cor atual do texto (`text-current`).
 * - Fa-lg define o tamanho grande dos ícones.
 */
export const BUTTON_ICONS: Record<ButtonIconKey, () => ReactNode> = {
  logout: () => <i className="fa-solid fa-arrow-right-from-bracket fa-lg text-current"></i>,
  email: () => <i className="fa-solid fa-envelope fa-lg text-current"></i>,
  settings: () => <i className="fa-solid fa-gear fa-lg text-current"></i>,
  money: () => <i className="fa-solid fa-money-bill-wave fa-lg"></i>,
};