import { Component, type JSX } from "react";
import type { UserIconProps } from "./UserIcon.types";
import { USER_ICON } from "./UserIcon.variants";

/**
 * UserIcon
 * ------------------------------------------------------------
 * Componente de ícone de usuário com nome.
 * Exibe um ícone visual seguido do nome do usuário.
 *
 * Props (UserIconProps):
 * - userName?: string → nome do usuário exibido ao lado do ícone.
 * - icon?: "classic" | ... → chave para selecionar o ícone no map USER_ICON.
 *
 * Renderização:
 * - Um container flex horizontal com gap entre ícone e nome.
 * - Ícone renderizado via USER_ICON[icon]().
 * - Nome do usuário com estilo de texto destacado.
 */
export class UserIcon extends Component<UserIconProps> {
  static defaultProps = {
    userName: "",  // valor padrão vazio
    icon: "classic", // ícone padrão
  };

  render(): JSX.Element {
    const { userName, icon } = this.props;

    return (
      <div className="flex items-center gap-3">
        {/* Ícone selecionado */}
        <span className="text-textColorHeader">{USER_ICON[icon]()}</span>

        {/* Nome do usuário */}
        <span className="text-textColorHeader text-lg font-extrabold font-lato">
          {userName}
        </span>
      </div>
    );
  }
}
