import { Component, type JSX } from "react"; 
import type { ButtonProps } from "./Button.types";
import classNames from "classnames";
import { BUTTON_ICONS } from "./ButtonIcons.variants";

/**
 * Button
 * ------------------------------------------------------------
 * Componente de botão reutilizável com suporte a:
 * - Diferentes variantes visuais: solid, border e bottomless.
 * - Tamanhos dinâmicos ou fixos.
 * - Ícones opcionais.
 * - Estado desabilitado.
 */
export class Button extends Component<ButtonProps> {
  static defaultProps = {
    text: "",
    disabled: false,
    type: "button",
    size: "auto" as string | number,
    variant: "solid",
  };

  render(): JSX.Element {
    const {
      text,
      icon,
      disabled,
      type,
      size,
      variant = "solid",
      onClick,
    } = this.props;

    // Define a classe de tamanho do botão
    let sizeClass = "";
    if (!text && icon) {
      // Botão só com ícone
      sizeClass =
        typeof size === "number"
          ? `w-[${size}rem]`
          : "min-w-[2.5rem] h-[2.5rem]";
    } else if (typeof size === "string") {
      // Botão com texto
      switch (size) {
        case "auto":
          sizeClass = "w-auto h-11"; // largura automática
          break;
        case "full":
          sizeClass = "w-full h-11"; // ocupa 100% da largura
          break;
        default:
          sizeClass = size; // string customizada
          break;
      }
    } else if (typeof size === "number") {
      // largura fixa em rem
      sizeClass = `w-[${size}rem] h-11`;
    }

    // Classes dinâmicas combinando variante, estado e tamanho
    const buttonClass = classNames(
      "p-2 text-md rounded font-bold flex items-center justify-center gap-2",
      sizeClass,
      {
        "min-w-[3rem]": !text && icon, // mínimo para ícone sozinho
        "bg-greenLight text-dark": variant === "solid",
        "bg-[#ff4444] text-dark": variant === "unpaid",
        "bg-dark border-[0.2rem] border-greenLight text-greenLight": variant === "border",
        "text-greenLight text-md hover:underline": variant === "bottomless"
      },
      {
        "transition-transform active:scale-95 hover:bg-greenMid focus:outline-none focus:ring-2 focus:ring-greenMid":
          !disabled && variant === "solid",
        "transition-transform active:scale-95 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-800":
          !disabled && variant === "unpaid",
        "transition-transform active:scale-95 hover:bg-greenLight hover:text-dark focus:outline-none focus:ring-2 focus:ring-greenLight":
          !disabled && variant === "border",
        "opacity-50 cursor-not-allowed": disabled, // desabilitado
      }
    );

    return (
      <button
        className={buttonClass}
        disabled={disabled}
        type={type}
        onClick={onClick}
      >
        {/* Renderiza ícone se fornecido */}
        {icon && BUTTON_ICONS[icon] && (
          <span className="flex items-center">{BUTTON_ICONS[icon]()}</span>
        )}
        {text} {/* Renderiza texto do botão */}
      </button>
    );
  }
}
