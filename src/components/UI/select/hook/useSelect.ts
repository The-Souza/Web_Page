import { useState, useMemo, useCallback, useEffect } from "react";
import type { SelectOption, UseSelectProps, UseSelectReturn } from "../Select.types";

/**
 * useSelect
 * ------------------------------------------------------------
 * Hook customizado para gerenciar o estado de um componente Select.
 * Suporta:
 * - Seleção de opção
 * - Filtragem de opções
 * - Navegação via teclado
 * - Controle de abertura/fechamento do dropdown
 * - Reset e limpeza de seleção
 * - Sincronização com valor externo (props.value)
 */
export const useSelect = (props: UseSelectProps & { value?: string }): UseSelectReturn => {
  const {
    options = [],
    placeholder = "Select an option",
    disabled = false,
    required = false,
    defaultValue,
  } = props;

  // 🔹 Estado para abrir/fechar dropdown
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Estado para a opção selecionada
  const [selected, setSelected] = useState<SelectOption | null>(
    defaultValue
      ? options.find((opt) => opt.value === defaultValue) ?? null
      : null
  );

  // 🔹 Estado para filtro de busca
  const [filter, setFilter] = useState("");

  // 🔹 Estado para índice destacado no teclado
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // 🔹 Opções filtradas com base no filtro
  const filteredOptions = useMemo(() => {
    if (!filter) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, options]);

  // 🔹 Alterna abertura do dropdown
  const toggleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setHighlightedIndex(-1); // reset índice ao abrir/fechar
    }
  }, [disabled]);

  // 🔹 Seleciona uma opção
  const selectOption = useCallback((option: SelectOption) => {
    setSelected(option);
    setIsOpen(false);
    setFilter(""); // limpa filtro
    setHighlightedIndex(-1);
  }, []);

  // 🔹 Reseta dropdown sem alterar seleção
  const resetSelect = useCallback(() => {
    setFilter("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  // 🔹 Limpa seleção e dropdown
  const clearSelection = useCallback(() => {
    setSelected(null);
    setFilter("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  /**
   * handleKeyDown
   * --------------------------------------------------------
   * Gerencia navegação via teclado:
   * - ArrowDown / ArrowUp: navegação
   * - Enter: seleciona opção destacada
   * - Escape: fecha/reset
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const length = filteredOptions.length;
    if (length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + length) % length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0) {
        selectOption(filteredOptions[highlightedIndex]);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      resetSelect();
    }
  };

  // 🔹 Validação de campo obrigatório
  const isValid = useMemo(() => {
    if (required && !disabled) {
      return selected !== null;
    }
    return true;
  }, [required, disabled, selected]);

  // 🔹 Label exibida no botão
  const selectedLabel =
    selected?.label && !isOpen ? selected.label : filter || placeholder;

  // 🔹 Sincronização com valor externo (props.value)
  useEffect(() => {
    if (props.value !== undefined) {
      const matched = options.find((opt) => opt.value === props.value) || null;
      if (matched) {
        selectOption(matched);
      } else {
        clearSelection();
      }
    }
  }, [props.value, options, selectOption, clearSelection]);

  return {
    selectedValue: selected?.value ?? null,
    selectedLabel,
    isOpen,
    toggleOpen,
    selectOption,
    filteredOptions,
    filter,
    setFilter,
    resetSelect,
    clearSelection,
    isValid,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    placeholder,
  };
};
