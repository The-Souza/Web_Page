import { forwardRef, useState, useEffect } from "react";
import classNames from "classnames";
import type { InputProps } from "./Input.types";

export const Input  = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      type = "text",
      placeholder,
      disabled = false,
      name,
      value,
      onChange,
      onBlur,
      autoComplete,
      theme = "light",
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [inputValue, setInputValue] = useState(String(value || ""));
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (value !== undefined) setInputValue(String(value));
    }, [value]);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const themeStyles: Record<
      "light" | "dark",
      { inputBase: string; inputBgWhenDisabled?: string; labelBase: string; wrapperBase: string }
    > = {
      light: {
        wrapperBase: "w-full flex flex-col gap-1 relative",
        inputBase: "w-full p-2 rounded-lg border-2 font-lato font-semibold",
        labelBase: "font-semibold text-md font-lato",
      },
      dark: {
        wrapperBase: "w-full flex flex-col gap-1 relative",
        // visual similar ao SelectButton
        inputBase:
          "w-full h-11 px-4 border-2 rounded-lg flex items-center font-lato font-semibold bg-dark",
        labelBase: "block mb-1 text-md font-bold font-lato",
      },
    };

    const base = themeStyles[theme];

    const inputClass = classNames(base.inputBase, {
      // comum
      "border-greenLight focus:outline-none focus:ring-1 focus:ring-greenLight":
        !disabled && !error && theme === "light",
      "opacity-50 cursor-not-allowed bg-gray-100": disabled && theme === "light",
      "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500":
        error && !disabled && theme === "light",
      // dark theme tweaks (keeps select-like background)
      "opacity-50 cursor-not-allowed": disabled && theme === "dark",
    });

    const labelClass = classNames(base.labelBase, {
      "text-greenLight": !disabled,
      "text-greenMid": disabled,
    });

    const errorClass = "text-sm font-lato text-red-500";
    const inputId = props.id || name;

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
      <div className={base.wrapperBase}>
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            name={name}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
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

        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
