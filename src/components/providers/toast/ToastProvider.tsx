import { useRef, useCallback } from "react";
import { Toast } from "@/components/UI/toast/Toast";
import { ToastContext } from "./ToastContext";
import type { ProvidersProps } from "../provider.types";
import type { ToastProps } from "@/components/UI/toast/Toast.types";
import type { ToastContextType } from "../provider.types";

export function ToastProvider({ children }: ProvidersProps) {
  const toastRef = useRef<ToastContextType>(null);

  const showToast = useCallback((options: ToastProps = {}) => {
    toastRef.current?.showToast(options);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
}