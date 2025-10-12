import { forwardRef, useState, useEffect } from "react";
import classNames from "classnames";
import type { FormFieldProps } from "./Input.types";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
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

    const inputClass = classNames("w-full p-2 rounded-lg border-2", {
      "border-greenLight focus:outline-none focus:ring-1 focus:ring-greenLight":
        !disabled && !error,
      "opacity-50 cursor-not-allowed bg-gray-100": disabled,
      "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500":
        error && !disabled,
    });

    const labelClass = classNames("font-semibold text-md font-lato", {
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
      <div className="w-full flex flex-col gap-1 relative">
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

FormField.displayName = "FormField";
