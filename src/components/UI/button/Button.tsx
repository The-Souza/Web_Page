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
export function Button({
  text,
  icon,
  disabled,
  type,
  size,
  variant = "solid",
  onClick,
}: ButtonProps) {
  // Define a classe de tamanho do botão
  let sizeClass = "";
  if (!text && icon) {
    // Botão só com ícone
    sizeClass =
      typeof size === "number" ? `w-[${size}rem]` : "min-w-[2.5rem] h-[2.5rem]";
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
    "p-2 text-md rounded-lg font-bold flex items-center justify-center gap-2",
    sizeClass,
    {
      "min-w-[3rem]": !text && icon, // mínimo para ícone sozinho
      "bg-primary text-black": variant === "solid",
      "bg-buttonSolidRed text-black": variant === "unpaid",
      "bg-transparent border-[0.2rem] border-buttonBorder text-buttonBorderText":
        variant === "border",
      "text-textColorHeader text-md hover:underline focus:outline-none":
        variant === "bottomless",

      "transition-transform active:scale-95 focus:outline-none focus:ring-2 hover:bg-buttonSolidHover focus:ring-buttonSolidHover":
        !disabled && variant === "solid",
      "transition-transform active:scale-95 focus:outline-none focus:ring-2 hover:bg-buttonSolidHoverRed focus:ring-buttonSolidHoverRed":
        !disabled && variant === "unpaid",
      "transition-transform active:scale-95 focus:outline-none focus:ring-2 hover:bg-buttonBorder hover:text-textColorHover focus:ring-buttonBorder":
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
