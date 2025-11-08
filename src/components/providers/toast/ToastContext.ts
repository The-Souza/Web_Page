import { createContext } from "react";
import type { ToastContextType } from "../provider.types";

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
