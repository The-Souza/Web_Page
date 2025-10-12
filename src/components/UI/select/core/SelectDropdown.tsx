import type { SelectOption, SelectDropdownProps } from "../Select.types";

export const SelectDropdown = ({
  filteredOptions,
  selectedValue,
  handleSelect,
  maxHeight = "15rem",
}: SelectDropdownProps) => {
  return (
    <ul
      className="absolute z-10 w-full mt-1 border rounded-md overflow-y-auto shadow-greenMid"
      style={{ maxHeight }}
    >
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option: SelectOption) => (
          <li
            key={option.value}
            className={`p-2 cursor-pointer hover:bg-greenDark transition-colors ${
              selectedValue === option.value ? "bg-greenMid font-semibold" : "bg-dark text-greenLight"
            }`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </li>
        ))
      ) : (
        <li className="p-2 text-greenDark">No options found</li>
      )}
    </ul>
  );
};
