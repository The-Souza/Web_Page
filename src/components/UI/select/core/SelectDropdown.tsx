import type { SelectOption, SelectDropdownProps } from "../Select.types";
import classNames from "classnames";

export const SelectDropdown = ({
  filteredOptions,
  selectedValue,
  handleSelect,
  highlightedIndex,
  maxHeight = "15rem",
}: SelectDropdownProps) => {
  return (
    <div className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden border-2 border-greenLight shadow-greenMid bg-dark">
      <ul className="overflow-y-auto" style={{ maxHeight }}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option: SelectOption, index) => {
            const liClass = classNames(
              "p-3 cursor-pointer font-lato font-semibold transition-colors",
              {
                "bg-greenMid text-white": selectedValue === option.value,
                "bg-greenDark text-white": highlightedIndex === index && selectedValue !== option.value,
                "bg-dark text-white": selectedValue !== option.value && highlightedIndex !== index,
                "hover:bg-greenMid hover:text-white": true,
              }
            );

            return (
              <li
                key={option.value}
                className={liClass}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            );
          })
        ) : (
          <li className="p-3 text-greenLight">No options found</li>
        )}
      </ul>
    </div>
  );
};
