import { useRef } from "react";
import type { SelectProps, SelectOption } from "./Select.types";
import { useSelect } from "./hook/useSelect";
import { SelectButton } from "./core/SelectButton";
import { SelectDropdown } from "./core/SelectDropdown";
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
  } = useSelect({
    options,
    placeholder,
    required,
    disabled,
    defaultValue,
  });

  const handleSelect = (option: SelectOption) => {
    selectOption(option);
    if (onChange) onChange(option.value);
  };

  const labelClass = classNames("block mb-1 text-md font-bold font-lato", {
    "text-greenLight": !disabled,
    "text-greenDark": disabled,
  });

  return (
    <div ref={wrapperRef} className="relative min-w-[12.5rem] w-full">
      <label className={labelClass}>{label}</label>

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
