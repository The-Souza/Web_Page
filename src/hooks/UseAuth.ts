import type { User } from "@/services/Auth.types";
import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };

    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const login = useCallback((token: string, userData: User) => {
    if (!token || !userData) {
      console.error("Invalid login data: missing token or user");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return {
    isAuthenticated,
    user,
    token: localStorage.getItem("token"),
    login,
    logout,
  };
}
