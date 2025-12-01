import { useRef, useEffect } from "react";
import type { SelectOption, SelectDropdownProps } from "../Select.types";
import classNames from "classnames";

/**
 * SelectDropdown
 * ------------------------------------------------------------
 * Componente responsável por renderizar o dropdown de opções
 * de um select customizado, incluindo destaque e scroll automático
 * para o item selecionado ou destacado.
 * 
 * Props:
 * - filteredOptions: lista de opções filtradas a serem exibidas
 * - selectedValue: valor atualmente selecionado
 * - handleSelect: callback chamado ao selecionar uma opção
 * - maxHeight: altura máxima do dropdown (padrão "15rem")
 * - highlightedIndex: índice do item atualmente destacado
 * - theme: tema do dropdown ("light" | "dark")
 */
export const SelectDropdown = ({
  filteredOptions,
  selectedValue,
  handleSelect,
  maxHeight = "15rem",
  highlightedIndex,
  theme = "dark",
}: SelectDropdownProps & { highlightedIndex: number }) => {
  const listRef = useRef<HTMLUListElement>(null);

  // 🔹 Efeito para manter o item destacado visível dentro do scroll
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const item = list.children[highlightedIndex] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex]);

  // ✅ Classe do container do dropdown, com tema e bordas
  const containerClass = classNames(
    "absolute z-10 w-full mt-1 border-2 rounded-lg overflow-hidden border-greenLight shadow-greenMid",
    {
      "bg-white": theme === "light",
      "bg-dark": theme === "dark",
    }
  );

  // ✅ Gera classes para cada opção dependendo se está selecionada ou destacada
  const optionClass = (isSelected: boolean, isHighlighted: boolean) =>
    classNames(
      "p-3 cursor-pointer font-lato font-semibold transition-colors",
      {
        // Tema light
        "bg-gray-400 text-black": isSelected && theme === "light",
        "bg-gray-300 text-black":
          !isSelected && isHighlighted && theme === "light",
        "text-black hover:bg-gray-300":
          !isSelected && !isHighlighted && theme === "light",

        // Tema dark
        "bg-greenMid text-white": isSelected && theme === "dark",
        "bg-greenDark text-white":
          !isSelected && isHighlighted && theme === "dark",
        "text-white hover:bg-greenDark":
          !isSelected && !isHighlighted && theme === "dark",
      }
    );

  return (
    <div className={containerClass} style={{ maxHeight }}>
      <ul
        ref={listRef} // 🔹 Referência para controle de scroll
        className="w-full"
        style={{ maxHeight, overflowY: "auto" }}
      >
        {filteredOptions.length > 0 ? (
          // ✅ Renderiza cada opção
          filteredOptions.map((option: SelectOption, index) => (
            <li
              key={option.value} // Chave única
              tabIndex={0} // Permite foco via teclado
              className={optionClass(
                selectedValue === option.value, // selecionado
                index === highlightedIndex // destacado
              )}
              onClick={() => handleSelect(option)} // Seleciona ao clicar
            >
              {option.label} {/* Label da opção */}
            </li>
          ))
        ) : (
          // ⚠️ Mensagem caso não haja opções
          <li
            className={classNames(
              "p-3 font-lato font-semibold italic",
              {
                "text-gray-400": theme === "light",
                "text-greenLight": theme === "dark",
              }
            )}
          >
            No options found
          </li>
        )}
      </ul>
    </div>
  );
};
