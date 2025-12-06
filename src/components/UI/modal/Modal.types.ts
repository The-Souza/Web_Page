import type { ReactNode } from "react";

/**
 * Tipagem padrão usada pelo componente Modal.
 *
 * 🔹 isOpen: controla se o modal está visível.
 * 🔹 onClose: função disparada ao fechar o modal.
 * 🔹 children: conteúdo interno exibido dentro do modal.
 * 🔹 variant: define o estilo/comportamento do modal.
 *    - "confirm": modal usado para ações de confirmação.
 *    - "default": modal padrão para exibir conteúdo genérico.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant: "confirm" | "default";
};
