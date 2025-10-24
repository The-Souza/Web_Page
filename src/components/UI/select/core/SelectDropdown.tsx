import { useRef, useEffect } from "react";
import type { SelectOption, SelectDropdownProps } from "../Select.types";
import classNames from "classnames";

export const SelectDropdown = ({
  filteredOptions,
  selectedValue,
  handleSelect,
  maxHeight = "15rem",
  highlightedIndex,
  theme = "dark",
}: SelectDropdownProps & { highlightedIndex: number }) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const item = list.children[highlightedIndex] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex]);

  const containerClass = classNames(
    "absolute z-10 w-full mt-1 border-2 rounded-lg overflow-hidden border-greenLight shadow-greenMid",
    {
      "bg-white": theme === "light",
      "bg-dark": theme === "dark",
    }
  );

  const optionClass = (isSelected: boolean, isHighlighted: boolean) =>
    classNames(
      "p-3 cursor-pointer font-lato font-semibold transition-colors",
      {
        "bg-gray-400 text-black": isSelected && theme === "light",
        "bg-gray-300 text-black":
          !isSelected && isHighlighted && theme === "light",
        "text-black hover:bg-gray-300":
          !isSelected && !isHighlighted && theme === "light",

        "bg-greenMid text-white": isSelected && theme === "dark",
        "bg-greenDark text-white":
          !isSelected && isHighlighted && theme === "dark",
        "text-white hover:bg-greenDark":
          !isSelected && !isHighlighted && theme === "dark",
      }
    );

  return (
    <div className={containerClass} style={{ maxHeight }}>
      <ul
        ref={listRef}
        className="w-full"
        style={{ maxHeight, overflowY: "auto" }}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option: SelectOption, index) => (
            <li
              key={option.value}
              tabIndex={0}
              className={optionClass(
                selectedValue === option.value,
                index === highlightedIndex
              )}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))
        ) : (
          <li
            className={classNames(
              "p-3 font-lato font-semibold italic",
              {
                "text-gray-400": theme === "light",
                "text-greenLight": theme === "dark",
              }
            )}
          >
            No options found
          </li>
        )}
      </ul>
    </div>
  );
};
