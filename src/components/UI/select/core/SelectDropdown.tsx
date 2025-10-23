import { useRef, useEffect } from "react";
import type { SelectOption, SelectDropdownProps } from "../Select.types";

export const SelectDropdown = ({
  filteredOptions,
  selectedValue,
  handleSelect,
  maxHeight = "15rem",
  highlightedIndex,
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

  return (
    <div
      className="absolute z-10 w-full mt-1 border-2 border-greenLight rounded-lg shadow-greenMid bg-dark overflow-hidden"
      style={{ maxHeight }}
    >
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
              className={`p-3 cursor-pointer font-lato font-semibold transition-colors ${
                selectedValue === option.value
                  ? "bg-greenMid text-white"
                  : index === highlightedIndex
                  ? "bg-greenDark text-white"
                  : "bg-dark text-white hover:bg-greenDark"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))
        ) : (
          <li className="p-3 font-lato font-semibold text-greenLight italic">No options found</li>
        )}
      </ul>
    </div>
  );
};
