import { useRef } from "react";
import classNames from "classnames";
import type { SelectButtonProps } from "../Select.types";
import { useTheme } from "@/providers/hook/useTheme";

/**
 * SelectButton
 * ------------------------------------------------------------
 * Componente responsável por renderizar o "botão" do select customizado,
 * que exibe o valor selecionado, placeholder e ícone de dropdown.
 * Também lida com foco, teclado e interações do usuário.
 *
 * Props:
 * - isOpen: indica se o dropdown está aberto
 * - disabled: indica se o select está desabilitado
 * - selectedLabel: label do item selecionado
 * - selectedValue: valor do item selecionado
 * - placeholder: texto do placeholder
 * - toggleOpen: função para abrir/fechar o dropdown
 * - filter: valor atual do filtro digitado
 * - setFilter: função para atualizar o filtro
 * - handleKeyDown: callback de teclado para navegação
 * - theme: tema do select ("light" | "dark")
 */
export const SelectButton = ({
  isOpen,
  disabled,
  selectedLabel,
  selectedValue,
  placeholder,
  toggleOpen,
  filter,
  setFilter,
  handleKeyDown,
  theme: themeProp,
  error,
}: SelectButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null); // 🔹 Referência para foco do input
  const { theme: appTheme } = useTheme();

  const resolvedTheme = themeProp ?? appTheme;

  // ✅ Classes do botão principal, dependendo do estado e tema
  const buttonClass = classNames(
    "w-full flex h-11 px-4 items-center justify-between border-2 rounded-lg font-lato font-semibold transition-colors",
    {
      "border-primary hover:ring-1 hover:ring-primary": !disabled,
      "ring-1 ring-primary": isOpen, // destaque quando aberto

      "bg-gray-100": resolvedTheme === "light",
      "bg-bgComponents": resolvedTheme === "dark",
      "border-red-500 focus-within:ring-1 focus-within:ring-red-500":
        error && !disabled,

      "opacity-50 cursor-not-allowed border-primary": disabled,
    }
  );

  // ✅ Classes do input interno, com cores e cursor dependendo do estado
  const inputClass = classNames(
    "bg-transparent outline-none w-full font-lato font-semibold transition-colors",
    {
      "text-black": selectedValue && resolvedTheme === "light",
      "text-textColor": selectedValue && resolvedTheme === "dark",
      "text-gray-400": !selectedValue && resolvedTheme === "light",
      "text-placeholder": !selectedValue && resolvedTheme === "dark",
      "cursor-pointer": !disabled,
      "cursor-not-allowed opacity-50": disabled,
    }
  );

  // ✅ Classes do ícone de dropdown, rotaciona quando aberto
  const iconClass = classNames("fas fa-caret-down ml-2 transition-transform", {
    "text-black": resolvedTheme === "light",
    "text-textColorHeader": resolvedTheme === "dark",
    "rotate-180": isOpen, // seta para cima quando aberto
    "opacity-50": disabled,
  });

  // 🔹 Clique no botão abre o dropdown e foca o input
  const handleClick = () => {
    if (!disabled) {
      toggleOpen();
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // 🔹 Captura tecla de espaço e delega para o handleKeyDown principal
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      event.preventDefault();
      setFilter((prev) => prev + " ");
    }
    handleKeyDown(event);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClass}
    >
      <input
        ref={inputRef}
        type="text"
        readOnly={!isOpen} // só permite digitar quando aberto
        value={isOpen ? filter : selectedLabel ?? ""}
        placeholder={isOpen ? "" : placeholder}
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={handleInputKeyDown}
        className={inputClass}
        tabIndex={-1} // não participa da ordem de tabulação
      />

      <i className={iconClass}></i>
    </button>
  );
};
