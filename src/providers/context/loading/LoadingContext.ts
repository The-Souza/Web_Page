import { createContext } from "react";
import type { LoadingContextType } from "../../provider.types";

// Cria um contexto para gerenciar o estado global de loading da aplicação.
// O tipo LoadingContextType define a estrutura esperada (ex.: isLoading, setLoading).
// O valor inicial é undefined porque o contexto deve obrigatoriamente ser
// fornecido por um Provider no nível superior da árvore de componentes.
// Isso ajuda a evitar uso incorreto do contexto sem um Provider,
// permitindo que custom hooks lancem erros claros quando necessário.
export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
