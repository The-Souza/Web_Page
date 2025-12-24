import { useEffect } from "react";
import { useLoading } from "@/providers";

/**
 * Componente de fallback para exibir loading durante a suspensão de componentes lazy.
 * @returns null ou overlay visual
 */
export const LoadingFallback = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    return () => setLoading(false);
  }, [setLoading]);

  return null;
};
