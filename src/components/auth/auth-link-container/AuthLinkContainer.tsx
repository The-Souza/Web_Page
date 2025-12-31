import type { JSX } from "react";
import type { AuthLinksContainerProps } from "./AuthLinkContainer.types";
import classNames from "classnames";
import { Children } from "react";

/**
 * AuthLinksContainer
 * ------------------------------------------------------------
 * Componente contêiner para agrupar links de autenticação (ex.: login, cadastro).
 * Ajusta o alinhamento dos elementos internos com base na quantidade de children:
 * 
 * Props:
 * - children: ReactNode
 *   Os elementos que serão renderizados dentro do contêiner.
 * - className?: string
 *   Classes adicionais de estilo que podem ser aplicadas ao contêiner.
 * 
 * Comportamento:
 * - Se houver apenas 1 child, centraliza o elemento (`justify-center`).
 * - Se houver mais de 1 child, distribui os elementos uniformemente (`justify-between`).
 */
export const AuthLinksContainer = ({
  children,
  className,
}: AuthLinksContainerProps): JSX.Element => {
  const count = Children.count(children);

  const containerClass = classNames(
    "flex gap-2 w-full text-primary text-md",
    {
      "justify-center": count === 1,
      "justify-between": count > 1,
    },
    className
  );

  return <div className={containerClass}>{children}</div>;
};
