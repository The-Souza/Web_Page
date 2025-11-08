import { forwardRef, useState } from "react";
import classNames from "classnames";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      type = "text",
      placeholder,
      disabled = false,
      name,
      value,
      defaultValue,
      onChange,
      onBlur,
      autoComplete,
      theme = "light",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isControlled = value !== undefined;

    const inputClass = classNames(
      "w-full p-2 rounded-lg border-2 font-lato font-semibold",
      {
        "border-greenLight hover:ring-1 hover:ring-greenLight focus:outline-none focus:ring-1 focus:ring-greenLight":
          !disabled && !error,
        "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500":
          error && !disabled,

        "bg-white text-black placeholder-gray-500": theme === "light",
        "opacity-50 cursor-not-allowed border-greenLight":
          disabled && theme === "light",

        "bg-dark text-greenLight placeholder-greenDark": theme === "dark",
        "opacity-50 cursor-not-allowed border-greenMid":
          disabled && theme === "dark",
      }
    );

    const labelClass = classNames("font-semibold text-md font-lato", {
      "text-greenLight": !disabled,
      "opacity-50 cursor-not-allowed text-greenMid": disabled,
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

    const togglePassword = () => setShowPassword((prev) => !prev);

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
            // 🔹 Suporte total a controlado e não-controlado
            {...(isControlled
              ? { value, onChange }
              : { defaultValue, onChange })}
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
