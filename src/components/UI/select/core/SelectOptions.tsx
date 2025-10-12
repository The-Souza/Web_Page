import type { SelectOptionsProps } from "../Select.types";

export const SelectOptions = ({ options, selectedValue, onSelect }: SelectOptionsProps) => {
  return (
    <>
      {options.map((option) => (
        <li
          key={option.value}
          className={`px-3 py-4 cursor-pointer font-lato font-bold hover:bg-greenDark transition-colors ${
            selectedValue === option.value ? "bg-greenMid text-dark" : "bg-dark text-white"
          }`}
          onClick={() => onSelect(option)}
        >
          {option.label}
        </li>
      ))}
    </>
  );
};
