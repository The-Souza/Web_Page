import { apiFetch } from "@/helpers/apiFetch";
import type { RegisterAccountPayload } from "@/types/account.types";
import type { ApiResponse } from "@/types/apiResponse";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function registerAccount(
  payload: RegisterAccountPayload
): Promise<ApiResponse<RegisterAccountPayload>> {
  try {
    const response = await apiFetch(`${BASE_URL}/accounts/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data?.message || (response.ok
        ? "Account registered successfully"
        : "Failed to register account"),
      data: data?.data ?? payload,
    };
  } catch (error) {
    console.error("❌ Error in registerAccount:", error);
    return {
      success: false,
      message: "Unexpected error while registering account.",
    };
  }
}
