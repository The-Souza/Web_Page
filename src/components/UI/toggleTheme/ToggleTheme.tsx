import { useTheme } from "@/providers/hook/useTheme";
import { Moon, Sun } from "lucide-react";

/**
 * ToggleTheme component
 * @returns JSX.Element - Botão para alternar entre temas claro e escuro.
 */
export function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className={`relative w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 border-2 border-textColorHeader justify-between ${
        isDark ? "bg-primaryMuted" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute w-6 h-6 rounded-full bg-bgComponents shadow transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      />

      <Sun className="w-4 h-4 text-yellow-400 ml-1 z-10" />
      <Moon className="w-4 h-4 text-textColor z-10" />
    </button>
  );
}
