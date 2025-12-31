import { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

// Propriedades do ThemeProvider
type Props = {
  children: React.ReactNode;
};

/**
 * Componente que gerencia o tema da aplicação.
 *
 * @param props - Propriedades do componente. 
 * @returns O provedor de tema que envolve os componentes filhos.
 */
export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  // Atualiza a classe do documento e o localStorage quando o tema muda
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Função para alternar entre os temas claro e escuro
  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
