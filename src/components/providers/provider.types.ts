import type { ToastProps } from "@/components/UI/toast/Toast.types";

export interface ToastContextType {
  showToast: (options?: ToastProps) => void;
}

export type ProvidersProps = {
  children: React.ReactNode;
};

