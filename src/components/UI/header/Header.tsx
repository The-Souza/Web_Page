import type { HeaderProps } from "./Header.types";
import classNames from "classnames";
import { Title, Button, UserIcon } from "@/components/index";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Header
 * ------------------------------------------------------------
 * Componente de cabeçalho fixo da aplicação.
 * Exibe título, logo, menu hambúrguer e ações de usuário (logout).
 *
 * Props (HeaderProps):
 * - text?: string → título do header (default: "Header Title").
 * - userName?: string → nome do usuário exibido no avatar.
 * - onClick?: () => void → callback do botão de logout.
 * - menuOpen?: boolean → indica se o menu lateral está aberto.
 * - onMenuToggle?: (open: boolean) => void → callback para abrir/fechar menu lateral.
 */
export function Header({
  text = "Header Title",
  userName = "",
  onClick,
  menuOpen = false,
  onMenuToggle,
}: HeaderProps) {
  // Detecta se a tela é mobile (width <= 639px)
  const isMobile = useMediaQuery("(max-width: 639px)");

  // Alterna o estado do menu lateral via callback
  const toggleMenu = () => {
    onMenuToggle?.(!menuOpen);
  };

  // Classes CSS dinâmicas do header
  const headerClass = classNames(
    "fixed top-0 left-0 flex w-full h-auto justify-between items-center py-5 px-5 sm:px-10 z-50",
    "bg-dark border-b-2 border-b-greenLight"
  );

  return (
    <header className={headerClass}>
      {/* Lado esquerdo: menu hambúrguer, logo e título */}
      <div className="flex gap-4 sm:gap-4 items-center justify-center">
        <button
          className="cursor-pointer"
          onClick={toggleMenu}
        >
          <i className="fa-solid fa-bars text-greenLight fa-2xl"></i>
        </button>
        <img src="/icon.png" alt="Logo" className="w-10 h-10" />
        <Title text={text} size="3xl" />
      </div>

      {/* Lado direito: avatar do usuário e botão de logout (apenas desktop) */}
      {!isMobile && (
        <div className="flex items-center gap-3">
          <UserIcon userName={userName} icon="classic" />
          <Button
            variant="border"
            icon="logout"
            text="Logout"
            size="auto"
            onClick={onClick}
          />
        </div>
      )}
    </header>
  );
}
