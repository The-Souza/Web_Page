import classNames from "classnames";
import type { SelectButtonProps } from "../Select.types";

export const SelectButton = ({
  isOpen,
  disabled,
  selectedLabel,
  toggleOpen,
}: SelectButtonProps) => {
  const buttonClass = classNames(
    "w-full h-10 px-4 border-2 rounded-lg flex justify-between items-center bg-dark",
    {
      "border-greenLight": !disabled,
      "ring-1 ring-greenLight": isOpen,
      "bg-dark opacity-1 cursor-not-allowed border-greenDark text-greenDark": disabled,
    }
  );
  return (
    <button
      type="button"
      onClick={toggleOpen}
      disabled={disabled}
      className={buttonClass}
    >
      <span
        className={`${selectedLabel ? "text-white" : ""} ${
          disabled ? "text-greenDark" : ""
        }`}
      >
        {selectedLabel || "Select an option"}
      </span>
      <i
        className={`fas fa-caret-down transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      ></i>
    </button>
  );
};
