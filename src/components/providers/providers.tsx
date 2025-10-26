import { ToastProvider } from "./toast/ToastProvider";
import { LoadingProvider } from "./loading/LoadingProvider";
import type { ProvidersProps } from "./provider.types";

export function Providers({
  children,
  debounceSec,
  safetySec,
}: ProvidersProps) {
  return (
    <LoadingProvider debounceSec={debounceSec} safetySec={safetySec}>
      <ToastProvider>{children}</ToastProvider>
    </LoadingProvider>
  );
}
