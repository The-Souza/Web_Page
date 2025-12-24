import { type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModalProps } from "./Modal.types";
import classNames from "classnames";

export function Modal({
  isOpen,
  onClose,
  children,
  variant,
}: ModalProps): JSX.Element {
  // Classes para o wrapper interno que contém o conteúdo do modal.
  // Aqui habilitamos o scroll vertical quando o conteúdo ultrapassa a altura máxima
  // e utilizamos uma classe customizada para esconder a scrollbar.
  const wrapperScroll = classNames(
    "overflow-y-auto max-h-[70vh] sm:max-h-[70vh] scrollbar-hidden"
  );

  // Classes do container principal do modal.
  // Inclui estilo base (cores, bordas, sombras, padding) e limites de tamanho.
  // Também ajusta largura/altura dependendo do variant ("default" ou "confirm").
  const classModal = classNames(
    "relative bg-dark border-2 border-greenLight rounded-2xl shadow-xl z-50",
    "max-h-[90vh] sm:max-h-[80vh]", // Limita o tamanho total do modal
    {
      // Modal padrão: largura maior e altura automática
      "w-[90%] md:w-[70%] xl:w-[50%] h-auto p-6 md:p-10": variant === "default",

      // Modal de confirmação: tamanho ajustável sem limite de altura
      "w-auto h-auto max-h-none p-6": variant === "confirm",
    }
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // Contêiner que centraliza o modal e ocupa toda a tela
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay escurecido atrás do modal */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose} // fecha ao clicar fora do modal
          />

          {/* Container animado do modal em si */}
          <motion.div
            className={classModal}
            initial={{ scale: 0.9, opacity: 0 }} // animação de entrada
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }} // animação de saída
          >
            {/* Área que contém o conteúdo do modal, com scroll quando necessário */}
            <div className={wrapperScroll}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
