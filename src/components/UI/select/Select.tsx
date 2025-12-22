import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { SelectProps, SelectOption, SelectHandle } from "./Select.types";
import { SelectButton } from "./core/SelectButton";
import { SelectDropdown } from "./core/SelectDropdown";
import { useSelect } from "./hook/useSelect";
import classNames from "classnames";

/**
 * Select
 * ------------------------------------------------------------
 * Componente de Select customizado, com suporte a:
 * - Controle de estado interno e externo via ref (reset, clear)
 * - Filtragem de opções
 * - Navegação via teclado
 * - Temas "light" e "dark"
 * - Dropdown com altura máxima customizável
 * - Validação de campo obrigatório
 */
export const Select = forwardRef<SelectHandle, SelectProps>(
  (
    {
      options,
      placeholder = "Select an option",
      disabled = false,
      required = false,
      defaultValue,
      label,
      error,
      maxHeight = "15rem",
      onChange,
      theme = "dark",
      value,
      sort
    }: SelectProps,
    ref
  ) => {
    // 🔹 Ref para detectar cliques fora do componente
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 🔹 Hook customizado que gerencia estado interno do select
    const {
      selectedValue,
      selectedLabel,
      isOpen,
      toggleOpen,
      selectOption,
      filteredOptions,
      isValid,
      filter,
      setFilter,
      resetSelect,
      clearSelection,
    } = useSelect({
      options,
      placeholder,
      required,
      disabled,
      defaultValue,
      value,
      sort,
    });

    // 🔹 Expondo métodos via ref (imperative handle)
    useImperativeHandle(ref, () => ({
      reset: () => resetSelect(),
      clear: () => clearSelection(),
      clearSelection: () => clearSelection(),
    }));

    // 🔹 Estado local para controlar índice destacado no teclado
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    // 🔹 Efeito para fechar dropdown ao clicar fora
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          resetSelect();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [resetSelect]);

    // 🔹 Função para selecionar uma opção
    const handleSelect = (option: SelectOption) => {
      selectOption(option);
      if (onChange) onChange(option.value); // dispara callback externo
    };

    /**
     * handleKeyDown
     * --------------------------------------------------------
     * Gerencia navegação via teclado:
     * - ArrowDown / ArrowUp: navegar entre opções
     * - Enter: selecionar opção destacada
     * - Escape: fechar/resetar
     * - Tab: navegar
     * - Space: abrir dropdown
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredOptions.length === 0) return;

      let nextIndex = highlightedIndex;

      switch (event.key) {
        case "ArrowDown":
          nextIndex = (highlightedIndex + 1) % filteredOptions.length;
          event.preventDefault();
          break;

        case "ArrowUp":
          nextIndex =
            (highlightedIndex - 1 + filteredOptions.length) %
            filteredOptions.length;
          event.preventDefault();
          break;

        case "Enter":
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          event.preventDefault();
          break;

        case "Escape":
          resetSelect();
          event.preventDefault();
          break;

        case "Tab":
          event.preventDefault();
          nextIndex = event.shiftKey
            ? (highlightedIndex - 1 + filteredOptions.length) %
              filteredOptions.length
            : (highlightedIndex + 1) % filteredOptions.length;
          break;

        case " ":
          if (event.target instanceof HTMLInputElement) return;
          toggleOpen();
          event.preventDefault();
          break;

        default:
          break;
      }

      setHighlightedIndex(nextIndex);
    };

    // 🔹 Classe para o label, mudando cor se disabled
    const labelClass = classNames("block mb-1 text-md font-bold font-lato", {
      "text-greenLight": !disabled,
      "text-greenDark": disabled,
    });

    return (
      <div ref={wrapperRef} className="relative min-w-[15rem] w-full">
        {/* Label opcional */}
        {label && <label className={labelClass}>{label}</label>}

        {/* Botão do Select */}
        <SelectButton
          isOpen={isOpen}
          disabled={disabled ?? false}
          selectedLabel={selectedLabel}
          selectedValue={selectedValue}
          toggleOpen={toggleOpen}
          filter={filter}
          setFilter={setFilter}
          handleKeyDown={handleKeyDown}
          placeholder={placeholder}
          theme={theme}
        />

        {/* Dropdown de opções */}
        {isOpen && (
          <SelectDropdown
            filteredOptions={filteredOptions}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
            maxHeight={maxHeight}
            filter={filter}
            setFilter={setFilter}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            handleKeyDown={handleKeyDown}
            placeholder={placeholder}
            theme={theme}
          />
        )}

        {/* Mensagem de erro para campos obrigatórios */}
        {!isValid && required && !disabled && (
          <span className="text-red-500 text-sm font-lato mt-1 block">
            {error || "This field is required"}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
