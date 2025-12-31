import { createContext } from "react";

// Definição do tipo Theme e do contexto ThemeContext
export type Theme = "light" | "dark";

// Definição do tipo do contexto
export type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

// Criação do contexto com valor inicial nulo
export const ThemeContext = createContext<ThemeContextType | null>(null);
