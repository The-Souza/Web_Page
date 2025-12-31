import { forwardRef, useState } from "react";
import classNames from "classnames";
import type { InputProps } from "./Input.types";

/**
 * Input
 * ------------------------------------------------------------
 * Componente de input reutilizável com suporte a:
 * - Temas claro e escuro
 * - Estados de erro e disabled
 * - Tipos de input variados (text, password, email etc.)
 * - Toggle de visibilidade para senhas
 * - Controlado ou não-controlado (value/defaultValue)
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label, // Label do input
      error, // Mensagem de erro
      type = "text", // Tipo do input
      placeholder, // Placeholder do input
      disabled = false, // Estado desabilitado
      name, // Nome do input
      value, // Valor controlado
      defaultValue, // Valor inicial não-controlado
      onChange, // Callback de mudança
      onBlur, // Callback de blur
      autoComplete, // Sugestão de preenchimento
      theme = "light", // Tema (light ou dark)
      ...props // Props adicionais
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false); // Toggle para visibilidade de senha
    const isControlled = value !== undefined; // Detecta se input é controlado

    // Classes dinâmicas do input
    const inputClass = classNames(
      "w-full py-2 px-4 rounded-lg border-2 font-lato font-semibold bg-gray-100 placeholder-gray-400",
      {
        "border-primary hover:ring-1 hover:ring-primary focus:outline-none focus:ring-1 focus:ring-primary":
          !disabled && !error,
        "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500":
          error && !disabled,

        "opacity-50 cursor-not-allowed border-primary": disabled,

        "text-white": theme === "dark",
        "text-black": theme === "light",
      }
    );

    // Classes do label
    const labelClass = classNames(
      "font-semibold text-md font-lato text-textColorHeader",
      {
        "opacity-50 cursor-not-allowed": disabled,
      }
    );

    const errorClass = "text-sm font-lato text-red-500 mt-1"; // Classe do erro
    const inputId = props.id || name; // ID para associar label e input

    // AutoComplete padrão inteligente baseado no tipo de input
    const defaultAutoComplete =
      autoComplete ??
      (type === "password"
        ? "new-password"
        : type === "email"
        ? "email"
        : type === "text"
        ? "name"
        : "off");

    // Função para alternar visibilidade da senha
    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
      <div className="w-full max-h-[96px] flex flex-col gap-1 relative">
        {/* Label */}
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
            // 🔹 Suporte a input controlado ou não-controlado
            {...(isControlled
              ? { value, onChange }
              : { defaultValue, onChange })}
            onBlur={onBlur}
            autoComplete={defaultAutoComplete}
            aria-label={label || placeholder}
            {...props}
          />

          {/* Ícone para toggle de senha */}
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

        {/* Mensagem de erro */}
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
