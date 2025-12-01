import type { SelectOptionsProps } from "../Select.types";

/**
 * SelectOptions
 * ------------------------------------------------------------
 * Componente responsável por renderizar uma lista de opções
 * dentro do dropdown de um select customizado.
 * 
 * Props:
 * - options: array de opções a serem exibidas
 * - onSelect: callback chamado ao clicar em uma opção
 */
export const SelectOptions = ({ options, onSelect }: SelectOptionsProps) => {
  return (
    <>
      {options.map((option) => (
        <li
          key={option.value} // ✅ Chave única para cada item da lista
          className="px-3 py-4 cursor-pointer font-lato font-bold" // Estilização e cursor pointer
          onClick={() => onSelect(option)} // 🔹 Chama callback ao clicar
        >
          {option.label} {/* Mostra o label da opção */}
        </li>
      ))}
    </>
  );
};
