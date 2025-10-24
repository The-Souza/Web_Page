import { useRef } from "react";
import classNames from "classnames";
import type { SelectButtonProps } from "../Select.types";

export const SelectButton = ({
  isOpen,
  disabled,
  selectedLabel,
  selectedValue,
  placeholder,
  toggleOpen,
  filter,
  setFilter,
  handleKeyDown,
  theme = "dark",
}: SelectButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const buttonClass = classNames(
    "w-full flex h-11 px-4 items-center justify-between border-2 rounded-lg font-lato font-semibold",
    {
      "border-greenLight hover:ring-1 hover:ring-greenLight": !disabled,
      "ring-1 ring-greenLight": isOpen,
      
      "bg-white": theme === "light",
      "opacity-50 cursor-not-allowed border-greenLight": disabled && theme === "light",

      "bg-dark": theme === "dark",
      "opacity-50 border-greenMid cursor-not-allowed": disabled && theme === "dark",
    }
  );

  const inputClass = classNames(
    "bg-transparent outline-none w-full font-lato font-semibold",
    {
      "text-gray-500 placeholder-gray-500": theme === "light" && !selectedValue,
      "text-greenDark placeholder-greenDark": theme === "dark" && !selectedValue,

      "text-black": theme === "light" && !!selectedValue,
      "text-white": theme === "dark" && !!selectedValue,
      
      "cursor-pointer": !disabled,
      "cursor-not-allowed opacity-50": disabled,
    }
  );
  
  const iconClass = classNames("fas fa-caret-down ml-2", {
    "text-greenLight": theme === "dark",
    "text-dark": theme === "light",
    "transform rotate-180": isOpen,
    "opacity-50": disabled,
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
        value={isOpen ? filter : selectedLabel ?? ""}
        placeholder={isOpen ? "" : placeholder}
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={handleInputKeyDown}
        className={inputClass}
        tabIndex={-1}
      />

      <i className={iconClass}></i>
    </button>
  );
};
