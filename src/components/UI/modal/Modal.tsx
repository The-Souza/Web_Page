import { type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModalProps } from "./Modal.types";
import classNames from "classnames";

export default function Modal({
  isOpen,
  onClose,
  children,
  variant,
}: ModalProps): JSX.Element {
  /**
   * Define dinamicamente as classes do modal com base no `variant`.
   *
   * - Usa a lib classNames para montar estilos condicionais
   * - `default` → modal grande (70% da tela)
   * - `confirm` → modal pequeno, usado para diálogos rápidos
   */
  const classModal = classNames(
    "relative bg-dark border border-greenLight rounded-2xl shadow-xl p-6 z-50",
    {
      "w-[70%] h-[70%]": variant === "default",
      "w-auto h-auto": variant === "confirm",
    }
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          /**
           * Container principal do modal
           *
           * - Fixa o modal no centro da tela
           * - Aplica animação de fade-in/out no fundo
           */
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 
            Overlay (fundo escurecido)
            - Clique no overlay fecha o modal
            - Usa blur + transparência
          */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 
            Caixa principal do modal com animação de scale
            - Aparece com zoom-in suave
            - Desaparece com zoom-out
          */}
          <motion.div
            className={classModal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Conteúdo passado pelo componente pai */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
