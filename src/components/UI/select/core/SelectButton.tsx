import { useRef } from "react";
import classNames from "classnames";
import type { SelectButtonProps } from "../Select.types";

export const SelectButton = ({
  isOpen,
  disabled,
  selectedLabel,
  placeholder,
  toggleOpen,
  filter,
  setFilter,
  handleKeyDown,
}: SelectButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const buttonClass = classNames(
    "w-full h-11 px-4 border-2 rounded-lg flex justify-between items-center font-lato font-semibold bg-dark",
    {
      "border-greenLight": !disabled,
      "ring-1 ring-greenLight": isOpen,
      "bg-dark cursor-not-allowed border-greenDark": disabled,
    }
  );

  const inputClass = classNames(
    "bg-transparent outline-none w-full placeholder-greenDark text-white font-lato font-semibold",
    { "cursor-pointer": !disabled, "cursor-not-allowed opacity-50": disabled }
  );

  const iconClass = classNames("fas fa-caret-down text-greenLight ml-2", {
    "transform rotate-180": isOpen,
  });

  const handleClick = () => {
    if (!disabled) {
      toggleOpen();
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      event.preventDefault();
      setFilter((prev) => prev + " ");
      return;
    }
    handleKeyDown(event);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClass}
    >
      <input
        ref={inputRef}
        type="text"
        readOnly={!isOpen}
        value={isOpen ? filter : selectedLabel || ""}
        placeholder={placeholder}
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={handleInputKeyDown}
        className={inputClass}
        tabIndex={-1}
      />

      <i className={iconClass}></i>
    </button>
  );
};
