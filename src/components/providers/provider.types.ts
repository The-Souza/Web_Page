import type { ToastProps } from "@/components/UI/toast/Toast.types";

export interface ToastContextType {
  showToast: (options?: ToastProps) => void;
}

export interface LoadingContextType {
  show: (message?: string) => void;
  hide: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  reset: () => void;
  isLoading: boolean;
  message?: string | null;
}

export type ProvidersProps = {
  children: React.ReactNode;
  debounceSec?: number;
  safetySec?: number;
};
