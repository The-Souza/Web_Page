import type { ReactNode } from "react";

/**
 * AuthLinksContainerProps
 * ------------------------------------------------------------
 * Interface de tipagem para o componente AuthLinksContainer.
 * 
 * Propriedades:
 * - children: ReactNode
 *   Os elementos React que serão renderizados dentro do contêiner.
 * - className?: string
 *   Classes CSS adicionais opcionais que podem ser aplicadas ao contêiner.
 */
export interface AuthLinksContainerProps {
  children: ReactNode;
  className?: string;
}