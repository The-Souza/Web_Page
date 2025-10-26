import { useContext } from "react";
import { ToastContext } from "../toast/ToastContext";
import type { ToastContextType } from "../provider.types";

export function useToast(): ToastContextType {
  const context = useContext<ToastContextType | undefined>(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
