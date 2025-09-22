import type { ToastProps } from "./Toast.types";

export const defaultToast: Required<Omit<ToastProps, "onClose">> = {
  type: "info",
  title: "Notification",
  text: "",
  duration: 5, // segundos
  dock: "top-left",
};
