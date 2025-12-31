import { useMemo } from "react";
import { useTheme } from "@/providers/hook/useTheme";
import { themeColors } from "../Chart.theme";

/**
 * Hook para obter as cores do tema atual.
 * @returns As cores correspondentes ao tema atual.
 */
export function useThemeColors() {
  const { theme } = useTheme();

  return useMemo(() => themeColors[theme], [theme]);
}
