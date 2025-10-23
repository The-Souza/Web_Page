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
  theme = "dark",
}: SelectButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const buttonClass = classNames(
    "w-full flex items-center justify-between border-2 rounded-lg font-lato font-semibold",
    {
      // Light theme
      "p-2 bg-white": theme === "light",
      "border-greenLight hover:ring-1 hover:ring-greenLight": !disabled && theme === "light",
      "opacity-50 cursor-not-allowed bg-gray-100": disabled && theme === "light",

      // Dark theme
      "h-11 px-4 bg-dark": theme === "dark",
      "border-greenLight": !disabled && theme === "dark",
      "ring-1 ring-greenLight": isOpen && theme === "dark",
      "border-greenDark cursor-not-allowed": disabled && theme === "dark",
    }
  );

  const inputClass = classNames(
    "bg-transparent outline-none w-full font-lato font-semibold",
    {
      "text-black placeholder-gray-400": theme === "light",
      "text-white placeholder-greenDark": theme === "dark",
      "cursor-pointer": !disabled,
      "cursor-not-allowed": disabled,
    }
  );

  const iconClass = classNames("fas fa-caret-down ml-2", {
    "text-greenLight": theme === "dark",
    "text-gray-400": theme === "light",
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
      <i className={iconClass} />
    </button>
  );
};
