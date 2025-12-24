import { useEffect, useState } from "react";

/**
 * useMediaQuery
 * ------------------------------------------------------------
 * Hook customizado para detectar mudanças em media queries CSS.
 * 
 * Permite reagir a alterações no tamanho da tela ou outras condições
 * definidas em CSS diretamente dentro do React.
 * 
 * @param query → string da media query, ex: "(max-width: 639px)"
 * @returns boolean → true se a media query atual corresponder, false caso contrário
 */
export function useMediaQuery(query: string) {
  // Estado que indica se a query corresponde ao momento atual
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Cria objeto MediaQueryList baseado na query
    const media = window.matchMedia(query);

    // Atualiza estado inicial
    setMatches(media.matches);

    // Listener para atualizar estado sempre que a query mudar
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    // Cleanup: remove listener quando o componente desmonta ou query muda
    return () => media.removeEventListener("change", listener);
  }, [query]); // Reexecuta efeito se a query mudar

  return matches; // Retorna true/false conforme correspondência
}
