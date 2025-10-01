import { forwardRef, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import type { FormFieldProps, Option } from "./Input.types";
import type { ChangeEvent } from "react";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      type = "text",
      options = [],
      placeholder,
      disabled = false,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(String(value || ""));
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Atualiza inputValue quando value muda
    useEffect(() => {
      if (type === "select") {
        const valStr = String(value || "");
        setFilteredOptions(
          options.filter((opt) =>
            opt.label.toLowerCase().includes(valStr.toLowerCase())
          )
        );
        setInputValue(
          options.find((opt) => opt.value === value)?.label || ""
        );
      } else {
        setInputValue(String(value || ""));
      }
    }, [value, options, type]);

    // Fechar dropdown ao clicar fora
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

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleSelectChange = (opt: Option) => {
      setInputValue(opt.label);
      const fakeEvent = { target: { value: opt.value } } as ChangeEvent<HTMLInputElement>;
      onChange?.(fakeEvent);
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (type !== "select" || !isOpen) return;

      const currentIndex = filteredOptions.findIndex((o) => o.label === inputValue);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % filteredOptions.length;
        const nextOption = filteredOptions[nextIndex];
        setInputValue(nextOption.label);
        const fakeEvent = { target: { value: nextOption.value } } as ChangeEvent<HTMLInputElement>;
        onChange?.(fakeEvent);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + filteredOptions.length) % filteredOptions.length;
        const prevOption = filteredOptions[prevIndex];
        setInputValue(prevOption.label);
        const fakeEvent = { target: { value: prevOption.value } } as ChangeEvent<HTMLInputElement>;
        onChange?.(fakeEvent);
      } else if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const inputClass = classNames(
      "w-full p-2 rounded border",
      "border-greenDark focus:outline-none focus:ring-2 focus:ring-greenLight",
      {
        "opacity-50 cursor-not-allowed bg-gray-100": disabled,
        "border-red-500": error,
      }
    );

    const labelClass = "font-semibold text-sm text-greenLight mb-1";
    const errorClass = "text-sm text-red-500 mt-1";

    return (
      <div className="w-full flex flex-col gap-1 relative">
        {label && <label className={labelClass}>{label}</label>}

        {type === "select" ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              disabled={disabled}
              onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);
                setFilteredOptions(
                  options.filter((opt) =>
                    opt.label.toLowerCase().includes(val.toLowerCase())
                  )
                );
                setIsOpen(true);
                onChange?.(e);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className={inputClass}
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
              ref={ref}
              type={type === "password" ? (showPassword ? "text" : "password") : type}
              placeholder={placeholder}
              className={inputClass}
              disabled={disabled}
              value={inputValue}
              onChange={onChange}
              {...props}
            />
            {type === "password" && (
              <i
                className={classNames(
                  "fa-solid absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer",
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
