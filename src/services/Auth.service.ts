import type { User, LoginResponse, CheckUserResponse } from "./Auth.types";
import { logFrontend } from "@/utils/Logger";

const BASE_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (user: User): Promise<LoginResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };

    logFrontend("USER REGISTERED");

    return {
      success: true,
      message: json.message,
      user: json.user,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Network error" };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };

    logFrontend("USER LOGGED IN");

    return {
      success: true,
      message: json.message,
      user: json.user,
      token: json.token,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Network error" };
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<LoginResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: newPassword }),
    });

    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };

    logFrontend("USER CHANGED PASSWORD");

    return {
      success: true,
      message: json.message,
      user: json.user,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Network error" };
  }
};

export const checkUserExists = async (
  email: string
): Promise<CheckUserResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/users/check-user-exists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();

    return {
      success: json.success ?? res.ok,
      exists: json.exists ?? false,
      message: json.message,
    } as CheckUserResponse;
  } catch (err) {
    console.error(err);
    return { success: false, exists: false, message: "Network error" };
  }
};
