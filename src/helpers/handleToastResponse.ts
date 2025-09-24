import type { ToastProps } from "@/components/UI/toast/Toast.types";
import type { LoginResponse } from "@/services";

export function handleToastResponse(
  response: LoginResponse,
  showToast: (toast: ToastProps) => void,
  successTitle = "Success",
  errorTitle = "Error",
  successText?: string,
  errorText?: string
) {
  if (response.success) {
    showToast({
      type: "success",
      title: successTitle,
      text: successText || response.message || "Operation completed successfully.",
    });
  } else {
    showToast({
      type: "error",
      title: errorTitle,
      text: errorText || response.message || "An unexpected error occurred.",
    });
  }
}