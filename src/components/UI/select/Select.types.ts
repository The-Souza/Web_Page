export interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
}

export interface UseSelectProps {
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}

export interface SelectProps extends UseSelectProps {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  maxHeight?: string;
  theme?: "light" | "dark";
}

export interface UseSelectReturn {
  selectedValue: string | null;
  selectedLabel: string | null;
  isOpen: boolean;
  toggleOpen: () => void;
  selectOption: (option: SelectOption) => void;
  filteredOptions: SelectOption[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  resetSelect: () => void;
  clearSelection: () => void;
  isValid: boolean;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export interface SelectHandle {
  reset: () => void;
  clear: () => void;
}

export interface SelectButtonProps {
  isOpen: boolean;
  disabled: boolean;
  selectedLabel: string | null;
  toggleOpen: () => void;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  theme?: "light" | "dark";
}

export interface SelectDropdownProps {
  filteredOptions: SelectOption[];
  selectedValue: string | null;
  handleSelect: (option: SelectOption) => void;
  maxHeight?: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  theme?: "light" | "dark";
}

export interface SelectOptionsProps {
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
}
