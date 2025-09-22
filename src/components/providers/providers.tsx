import { ToastProvider } from "./ToastProvider";
import type { ProvidersProps } from "./provider.types";

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      {/* Futuramente, adicione outros providers aqui */}
      {children}
    </ToastProvider>
  );
}
