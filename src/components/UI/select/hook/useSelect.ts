import { useState, useMemo } from "react";
import type { SelectOption, UseSelectProps, UseSelectReturn } from "../Select.types";

export const useSelect = (props: UseSelectProps): UseSelectReturn => {
  const {
    options = [],
    placeholder = "Select an Option",
    disabled = false,
    required = false,
    defaultValue
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(
    defaultValue
      ? options.find((opt) => opt.value === defaultValue) ?? null
      : null
  );
  const [filter, setFilter] = useState("");

  const toggleOpen = (): void => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const selectOption = (option: SelectOption): void => {
    setSelected(option);
    setIsOpen(false);
    setFilter("");
  };

  const resetSelect = (): void => {
    setSelected(null);
    setFilter("");
    setIsOpen(false);
  };

  const filteredOptions = useMemo(() => {
    if (!filter) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, options]);

  const isValid = useMemo(() => {
    if (required && !disabled) {
      return selected !== null;
    }
    return true;
  }, [required, disabled, selected]);

  return {
    selectedValue: selected?.value ?? null,
    selectedLabel: selected?.label ?? placeholder,
    isOpen,
    toggleOpen,
    selectOption,
    filteredOptions,
    filter,
    setFilter,
    resetSelect,
    isValid,
  };
};
