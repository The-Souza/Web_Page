import { forwardRef, useState, useEffect, useRef, type ChangeEvent } from "react";
import classNames from "classnames";
import type { FormFieldProps, Option } from "./Input.types";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      type = "text",
      options = [],
      placeholder,
      disabled = false,
      name,
      value,
      onChange,
      onBlur,
      autoComplete,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;

    // Estado interno
    const [inputValue, setInputValue] = useState(String(value || ""));
    const [showPassword, setShowPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Sincroniza value externo
    useEffect(() => {
      if (value !== undefined) setInputValue(String(value));
    }, [value]);

    // Fecha dropdown ao clicar fora
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Alterna visibilidade da senha
    const togglePassword = () => setShowPassword((prev) => !prev);

    // Handle seleção de opção
    const handleSelectChange = (opt: Option) => {
      setInputValue(opt.label);
      const fakeEvent = { target: { value: opt.value } } as ChangeEvent<HTMLInputElement>;
      onChange?.(fakeEvent);
      setIsOpen(false);
    };

    // Navegação por teclado no select
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type !== "select" || !isOpen) return;

      const currentIndex = filteredOptions.findIndex((o) => o.label === inputValue);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % filteredOptions.length;
        const nextOption = filteredOptions[nextIndex];
        setInputValue(nextOption.label);
        onChange?.({ target: { value: nextOption.value } } as ChangeEvent<HTMLInputElement>);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + filteredOptions.length) % filteredOptions.length;
        const prevOption = filteredOptions[prevIndex];
        setInputValue(prevOption.label);
        onChange?.({ target: { value: prevOption.value } } as ChangeEvent<HTMLInputElement>);
      } else if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    // Classes de estilo
    const inputClass = classNames(
      "w-full p-2 rounded-lg border-2",
      {
        "border-greenLight focus:outline-none focus:ring-1 focus:ring-greenLight": !disabled && !error,
        "opacity-50 cursor-not-allowed bg-gray-100": disabled,
        "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500": error && !disabled,
      }
    );

    const labelClass = classNames("font-semibold text-md font-lato", {
      "text-greenLight": !disabled,
      "text-greenMid": disabled,
    });

    const errorClass = "text-sm font-lato text-red-500";

    const inputId = props.id || name;

    // Definindo autocomplete padrão inteligente
    const defaultAutoComplete =
      autoComplete ??
      (type === "password"
        ? "new-password"
        : type === "email"
        ? "email"
        : type === "text"
        ? "name"
        : "off");

    return (
      <div className="w-full flex flex-col gap-1 relative">
        {label && <label htmlFor={inputId} className={labelClass}>{label}</label>}

        {type === "select" ? (
          <div className="relative">
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              disabled={disabled}
              onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);
                setFilteredOptions(options.filter((opt) =>
                  opt.label.toLowerCase().includes(val.toLowerCase())
                ));
                setIsOpen(true);
                onChange?.(e);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className={inputClass}
              autoComplete="off"
              aria-label={label || placeholder}
              {...props}
            />
            <i
              className={classNames(
                "fa-solid fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform",
                { "rotate-180": isOpen }
              )}
              onClick={() => setIsOpen((prev) => !prev)}
            />
            {isOpen && (
              <ul
                ref={dropdownRef}
                className="absolute w-full max-h-60 overflow-auto border border-greenDark rounded mt-1 bg-dark z-10"
              >
                {filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    className={classNames(
                      "p-2 hover:bg-greenLight hover:text-dark cursor-pointer",
                      { "bg-greenLight text-dark": inputValue === opt.label }
                    )}
                    onClick={() => handleSelectChange(opt)}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="relative">
            <input
              id={inputId}
              ref={ref}
              name={name}
              type={type === "password" ? (showPassword ? "text" : "password") : type}
              placeholder={placeholder}
              className={inputClass}
              disabled={disabled}
              value={isControlled ? value : inputValue}
              onChange={(e) => {
                if (!isControlled) setInputValue(e.target.value);
                onChange?.(e);
              }}
              onBlur={onBlur}
              autoComplete={defaultAutoComplete}
              aria-label={label || placeholder}
              {...props}
            />
            {type === "password" && (
              <i
                className={classNames(
                  "fa-solid text-black absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer",
                  showPassword ? "fa-eye-slash" : "fa-eye"
                )}
                onClick={togglePassword}
              />
            )}
          </div>
        )}

        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
