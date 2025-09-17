import { forwardRef } from "react";
import classNames from "classnames";
import type { InputProps } from "./Input.types";

// Usando forwardRef para integração com react-hook-form
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, type = "text", disabled = false, error, className, ...props }, ref) => {
    const inputClass = classNames(
      "w-full p-2 rounded border",
      "border-greenDark focus:outline-none focus:ring-2 focus:ring-greenLight",
      {
        "opacity-50 cursor-not-allowed bg-gray-100": disabled,
        "border-red-500": error,
      },
      className
    );

    const errorClass = classNames("text-sm text-greenLight");

    return (
      <div className="w-full flex flex-col gap-1">
        <input
          type={type}
          placeholder={placeholder}
          className={inputClass}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
