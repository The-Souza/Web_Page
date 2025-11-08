import { useContext } from "react";
import { LoadingContext } from "../loading/LoadingContext";
import type { LoadingContextType } from "../provider.types";

export function useLoading(): LoadingContextType {
  const ctx = useContext<LoadingContextType | undefined>(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return ctx;
}