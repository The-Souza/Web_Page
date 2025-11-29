import { createContext } from "react";
import type { ToastContextType } from "../../provider.types";

/**
 * ==================================================
 *  ToastContext
 * ==================================================
 * Contexto responsável por disponibilizar a função
 * `showToast()` para qualquer componente da aplicação.
 *
 * O contexto inicia como `undefined` porque:
 *   - Isso permite validar se o hook useToast()
 *     está sendo usado dentro do <ToastProvider>.
 *   - Garante segurança e evita comportamento silencioso
 *     caso o provider não esteja presente.
 *
 * O ToastContextType define o formato do valor esperado,
 * garantindo tipagem segura ao consumir o contexto.
 */
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined // Valor inicial (antes do provider injetar algo)
);
