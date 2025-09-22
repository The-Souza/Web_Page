import type { User, LoginResponse } from "./Auth.types";
import { logFrontend } from "@/utils/Logger";

const BASE_URL = "http://localhost:5000";

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
    return { success: true };
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
    return { success: true };
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
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Network error" };
  }
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/users/check-user-exists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    return json.exists ?? false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

