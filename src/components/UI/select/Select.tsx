import { useRef, useState, useEffect } from "react";
import type { SelectProps, SelectOption } from "./Select.types";
import { SelectButton } from "./core/SelectButton";
import { SelectDropdown } from "./core/SelectDropdown";
import { useSelect } from "./hook/useSelect";
import classNames from "classnames";

export const Select = ({
  options,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  defaultValue,
  label,
  error,
  maxHeight = "15rem",
  onChange,
}: SelectProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

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
  } = useSelect({
    options,
    placeholder,
    required,
    disabled,
    defaultValue,
  });

  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        resetSelect();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [resetSelect]);

  // Atualiza highlightedIndex quando lista muda
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  const handleSelect = (option: SelectOption) => {
    selectOption(option);
    if (onChange) onChange(option.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredOptions.length === 0) return;

    let nextIndex = highlightedIndex;

    switch (event.key) {
      case "ArrowDown":
        nextIndex = (highlightedIndex + 1) % filteredOptions.length;
        event.preventDefault();
        break;
      case "ArrowUp":
        nextIndex = (highlightedIndex - 1 + filteredOptions.length) % filteredOptions.length;
        event.preventDefault();
        break;
      case "Enter":
        handleSelect(filteredOptions[highlightedIndex]);
        event.preventDefault();
        break;
      case "Escape":
        resetSelect();
        event.preventDefault();
        break;
      case "Tab":
        resetSelect();
        break;
      default:
        break;
    }

    setHighlightedIndex(nextIndex);
  };

  const labelClass = classNames("block mb-1 text-md font-bold font-lato", {
    "text-greenLight": !disabled,
    "text-greenDark": disabled,
  });

  return (
    <div ref={wrapperRef} className="relative min-w-[12.5rem] w-full">
      {label && <label className={labelClass}>{label}</label>}

      <SelectButton
        isOpen={isOpen}
        disabled={disabled}
        selectedLabel={selectedLabel}
        toggleOpen={toggleOpen}
      />

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
        />
      )}

      {!isValid && required && !disabled && (
        <span className="text-red-500 text-sm font-lato mt-1 block">
          {error || "This field is required"}
        </span>
      )}
    </div>
  );
};
