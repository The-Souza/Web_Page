import type { SelectOptionsProps } from "../Select.types";

export const SelectOptions = ({ options, onSelect }: SelectOptionsProps) => {
  return (
    <>
      {options.map((option) => (
        <li
          key={option.value}
          className="px-3 py-4 cursor-pointer font-lato font-bold"
          onClick={() => onSelect(option)}
        >
          {option.label}
        </li>
      ))}
    </>
  );
};
