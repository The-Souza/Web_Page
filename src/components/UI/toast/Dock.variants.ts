import type { DockProps, ToastDock } from "./Toast.types";

export const DOCK_VARIANTS_DESKTOP: Record<ToastDock, DockProps> =
  {
    "top-left": { top: "2.5rem", left: "2.5rem" },
    "top-center": { top: "2.5rem", left: "50%", transform: "translateX(-50%)" },
    "top-right": { top: "2.5rem", right: "2.5rem" },
    "bottom-left": { bottom: "2.5rem", left: "2.5rem" },
    "bottom-center": {
      bottom: "2.5rem",
      left: "50%",
      transform: "translateX(-50%)",
    },
    "bottom-right": { bottom: "2.5rem", right: "2.5rem" },
  };

export const DOCK_VARIANTS_MOBILE: Record<ToastDock, DockProps> = {
  "top-left": { top: "1rem", left: "1rem" },
  "top-center": { top: "1rem", left: "50%", transform: "translateX(-50%)" },
  "top-right": { top: "1rem", right: "1rem" },
  "bottom-left": { bottom: "1rem", left: "1rem" },
  "bottom-center": {
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
  },
  "bottom-right": { bottom: "1rem", right: "1rem" },
};
