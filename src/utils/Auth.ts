import { logFrontend } from "./Logger";
import type { User } from "../../backend/User.types";

const BASE_URL = "http://localhost:5000"; // URL do backend

export const registerUser = async (user: User): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const json = await res.json();
    if (!res.ok) {
      console.warn(json.message);
      return false;
    }
    logFrontend("USER REGISTERED");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.warn(json.message);
      return false;
    }
    logFrontend("USER LOGGED IN");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: newPassword }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.warn(json.message);
      return false;
    }
    logFrontend("USER CHANGED PASSWORD");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/check-user-exists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    return json.exists;
  } catch (err) {
    console.error(err);
    return false;
  }
};
