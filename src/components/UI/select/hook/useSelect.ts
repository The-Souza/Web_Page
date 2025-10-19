import { useState, useMemo, useCallback } from "react";
import type { SelectOption, UseSelectProps, UseSelectReturn } from "../Select.types";

export const useSelect = (props: UseSelectProps): UseSelectReturn => {
  const {
    options = [],
    placeholder = "Select an option",
    disabled = false,
    required = false,
    defaultValue,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(
    defaultValue
      ? options.find((opt) => opt.value === defaultValue) ?? null
      : null
  );
  const [filter, setFilter] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const filteredOptions = useMemo(() => {
    if (!filter) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, options]);

  const toggleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setHighlightedIndex(-1);
    }
  }, [disabled]);

  const selectOption = useCallback((option: SelectOption) => {
    setSelected(option);
    setIsOpen(false);
    setFilter("");
    setHighlightedIndex(-1);
  }, []);

  const resetSelect = useCallback(() => {
    setFilter("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

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

  const isValid = useMemo(() => {
    if (required && !disabled) {
      return selected !== null;
    }
    return true;
  }, [required, disabled, selected]);

  const selectedLabel =
    selected?.label && !isOpen ? selected.label : filter || placeholder;

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
    isValid,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    placeholder,
  };
};
