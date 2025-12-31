import type { JSX } from "react";
import type { AuthFormProps } from "./AuthForm.types";
import classNames from "classnames";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * AuthForm
 * ------------------------------------------------------------
 * Componente de formulário de autenticação (login, cadastro, etc.)
 * - Recebe uma função onSubmit para tratar o envio do formulário.
 * - Recebe children para renderizar campos, botões e outros elementos dentro do formulário.
 * - Responsivo: ajusta a largura do formulário dependendo do tamanho da tela.
 */
export const AuthForm = ({
  onSubmit,
  children,
}: AuthFormProps): JSX.Element => {
  const isMobile = useMediaQuery("(max-width: 640px)"); // detecta se é tela pequena
  const formClass = classNames(
    "bg-bgComponents rounded-lg flex flex-col p-8 sm:p-10 items-center justify-center gap-6 border-2 border-primary",
    {
      "w-full": isMobile,           // ocupa largura total em telas pequenas
      "w-[31.25rem]": !isMobile,    // largura fixa em telas maiores
    }
  );

  return (
    <form onSubmit={onSubmit} className={formClass}>
      {children} {/* Renderiza campos, botões e outros elementos passados como children */}
    </form>
  );
};
