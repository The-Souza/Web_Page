import { api } from "@/lib/api";
import type { RegisterAccountPayload } from "@/types/account.types";
import type { ApiResponse } from "@/types/apiResponse";

export async function registerAccount(
  payload: RegisterAccountPayload
): Promise<ApiResponse<RegisterAccountPayload>> {
  try {
    const response = await api.post<ApiResponse<RegisterAccountPayload>>(
      "/accounts/register",
      payload
    );

    return {
      success: response.status === 200 || response.status === 201,
      message: response.data?.message || "Account registered successfully",
      data: response.data?.data ?? payload,
    };
  } catch (error: unknown) {
    // 🚨 Faz o cast de erro para AxiosError (se estiver usando axios)
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to register account. Please try again.",
      };
    }

    return {
      success: false,
      message: "Unexpected error while registering account.",
    };
  }
}
