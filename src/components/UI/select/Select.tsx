import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import type { SelectProps, SelectOption, SelectHandle } from "./Select.types";
import { SelectButton } from "./core/SelectButton";
import { SelectDropdown } from "./core/SelectDropdown";
import { useSelect } from "./hook/useSelect";
import classNames from "classnames";

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
    }: SelectProps,
    ref
  ) => {
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
      clearSelection,
    } = useSelect({
      options,
      placeholder,
      required,
      disabled,
      defaultValue,
    });

    useImperativeHandle(ref, () => ({
      reset: () => {
        resetSelect();
      },
      clear: () => {
        // limpa seleção e estado interno
        clearSelection();
      },
    }));

    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

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
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [resetSelect]);

    useEffect(() => {
      setHighlightedIndex(-1);
    }, [filteredOptions]);

    const handleSelect = (option: SelectOption) => {
      selectOption(option);
      if (onChange) onChange(option.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      if (filteredOptions.length === 0) return;

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

    const labelClass = classNames("block mb-1 text-md font-bold font-lato", {
      "text-greenLight": !disabled,
      "text-greenDark": disabled,
    });

    return (
      <div ref={wrapperRef} className="relative min-w-[15rem] w-full">
        {label && <label className={labelClass}>{label}</label>}

        <SelectButton
          isOpen={isOpen}
          disabled={disabled ?? false}
          selectedLabel={selectedLabel}
          toggleOpen={toggleOpen}
          filter={filter}
          setFilter={setFilter}
          handleKeyDown={handleKeyDown}
          placeholder={placeholder}
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
  }
);

Select.displayName = "Select";

export default Select;
