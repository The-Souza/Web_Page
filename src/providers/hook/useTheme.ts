import { useContext } from "react";
import { ThemeContext } from "@/providers/context/theme/ThemeContext";

/**
 * Hook para acessar o contexto de tema.
 * @returns O contexto de tema atual.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
