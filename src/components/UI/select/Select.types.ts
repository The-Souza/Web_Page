/**
 * SelectOption
 * ------------------------------------------------------------
 * Define a estrutura de cada opção disponível no componente Select.
 * - value: valor único da opção.
 * - label: texto exibido para o usuário.
 * - selected?: indica se a opção vem selecionada por padrão.
 */
export interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
}

/**
 * UseSelectProps
 * ------------------------------------------------------------
 * Propriedades básicas passadas ao hook de Select personalizado.
 * - options: lista de opções disponíveis.
 * - placeholder?: texto exibido quando nenhuma opção está selecionada.
 * - required?: indica se a seleção é obrigatória.
 * - disabled?: desabilita o select.
 * - defaultValue?: valor inicial selecionado.
 * - sort?: configuração de ordenação das opções.
 */
export interface UseSelectProps {
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  sort?: SelectSortConfig;
}

/**
 * SelectProps
 * ------------------------------------------------------------
 * Extende UseSelectProps adicionando propriedades específicas do componente.
 * - label?: texto de label do campo.
 * - error?: mensagem de erro.
 * - onChange?: callback disparado ao selecionar um valor.
 * - maxHeight?: altura máxima do dropdown.
 * - theme?: "light" | "dark" para customizar cores.
 * - value?: valor controlado do select.
 */
export interface SelectProps extends UseSelectProps {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  maxHeight?: string;
  theme?: "light" | "dark";
  value?: string;
}

/**
 * UseSelectReturn
 * ------------------------------------------------------------
 * Tipagem retornada pelo hook de Select.
 * Contém estado e métodos para controlar o select.
 */
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

/**
 * SelectHandle
 * ------------------------------------------------------------
 * Métodos expostos via ref do componente Select.
 * Permite manipular o select externamente.
 */
export interface SelectHandle {
  reset: () => void;
  clear: () => void;
  clearSelection: () => void;
}

/**
 * SelectButtonProps
 * ------------------------------------------------------------
 * Props para o botão que exibe o valor selecionado e controla a abertura do dropdown.
 */
export interface SelectButtonProps {
  isOpen: boolean;
  disabled: boolean;
  selectedLabel: string | null;
  selectedValue?: string | null;
  toggleOpen: () => void;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  theme?: "light" | "dark";
}

/**
 * SelectDropdownProps
 * ------------------------------------------------------------
 * Props para o dropdown de opções do Select.
 * Controla seleção, filtragem, navegação por teclado e aparência.
 */
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

/**
 * SelectOptionsProps
 * ------------------------------------------------------------
 * Props simples para renderização da lista de opções dentro do dropdown.
 */
export interface SelectOptionsProps {
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
}

/**
 * SelectSortConfig
 * ------------------------------------------------------------
 * Configuração opcional de ordenação das opções do Select.
 */
export interface SelectSortConfig {
  by?: "label" | "value";
  direction?: "asc" | "desc";
}
