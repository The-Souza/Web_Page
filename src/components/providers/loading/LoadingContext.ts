import { createContext } from "react";
import type { LoadingContextType } from "../provider.types";

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);