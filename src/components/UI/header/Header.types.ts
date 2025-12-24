/**
 * HeaderProps
 * ------------------------------------------------------------
 * Define as propriedades aceitas pelo componente Header.
 */
export interface HeaderProps {
  /** Título exibido no header */
  text: string;

  /** Nome do usuário para exibição no avatar (opcional) */
  userName?: string;

  /** Callback chamado ao clicar no botão de logout (opcional) */
  onClick?: () => void;

  /** Indica se o menu lateral está aberto (opcional) */
  menuOpen?: boolean;

  /** Callback para alternar o estado do menu lateral (opcional) */
  onMenuToggle?: (open: boolean) => void;
}
