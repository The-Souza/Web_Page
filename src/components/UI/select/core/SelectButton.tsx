import classNames from "classnames";
import type { SelectButtonProps } from "../Select.types";

export const SelectButton = ({
  isOpen,
  disabled,
  selectedLabel,
  toggleOpen,
  filter,
  setFilter,
  handleKeyDown,
}: SelectButtonProps) => {
  const buttonClass = classNames(
    "w-full h-10 px-4 border-2 rounded-lg flex justify-between items-center font-lato font-semibold bg-dark",
    {
      "border-greenLight": !disabled,
      "ring-1 ring-greenLight": isOpen,
      "bg-dark opacity-50 cursor-not-allowed border-greenDark text-greenDark": disabled,
    }
  );

  const spanClass = classNames("", {
    "text-white": selectedLabel && !disabled,
    "text-greenDark": disabled,
  });

  return (
    <button
      type="button"
      onClick={toggleOpen}
      disabled={disabled}
      className={buttonClass}
    >
      {isOpen ? (
        <input
          type="text"
          value={filter}
          autoFocus
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent w-full outline-none text-white font-lato font-semibold placeholder:text-greenLight"
          placeholder={selectedLabel || ""}
        />
      ) : (
        <span className={spanClass}>{selectedLabel}</span>
      )}

      <i
        className={`fas fa-caret-down transition-transform duration-200 ${
          isOpen ? "rotate-180 text-white" : "text-greenLight"
        }`}
      ></i>
    </button>
  );
};
