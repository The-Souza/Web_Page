import type { DockProps, ToastDock } from "./Toast.types";

/**
 * DOCK_VARIANTS_DESKTOP
 * ------------------------------------------------------------
 * Define posições de ancoragem (dock) para toasts em desktop.
 * Cada chave corresponde a uma posição possível (top-left, top-center, etc.).
 * Os valores definem CSS inline para posicionamento do toast.
 */
export const DOCK_VARIANTS_DESKTOP: Record<ToastDock, DockProps> = {
  "top-left": { top: "2.5rem", left: "2.5rem" }, // canto superior esquerdo
  "top-center": { top: "2.5rem", left: "50%", transform: "translateX(-50%)" }, // topo centralizado horizontalmente
  "top-right": { top: "2.5rem", right: "2.5rem" }, // canto superior direito
  "bottom-left": { bottom: "2.5rem", left: "2.5rem" }, // canto inferior esquerdo
  "bottom-center": { bottom: "2.5rem", left: "50%", transform: "translateX(-50%)" }, // inferior centralizado horizontalmente
  "bottom-right": { bottom: "2.5rem", right: "2.5rem" }, // canto inferior direito
};

/**
 * DOCK_VARIANTS_MOBILE
 * ------------------------------------------------------------
 * Mesma lógica do desktop, mas com espaçamento reduzido para telas menores.
 * Mantém responsividade do toast.
 */
export const DOCK_VARIANTS_MOBILE: Record<ToastDock, DockProps> = {
  "top-left": { top: "1rem", left: "1rem" },
  "top-center": { top: "1rem", left: "50%", transform: "translateX(-50%)" },
  "top-right": { top: "1rem", right: "1rem" },
  "bottom-left": { bottom: "1rem", left: "1rem" },
  "bottom-center": { bottom: "1rem", left: "50%", transform: "translateX(-50%)" },
  "bottom-right": { bottom: "1rem", right: "1rem" },
};
