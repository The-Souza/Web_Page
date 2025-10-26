import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { LoadingContext } from "./LoadingContext";
import LoadingOverlay from "@/components/UI/loading/LoadingOverlay";
import type { ProvidersProps } from "../provider.types";

export function LoadingProvider({
  children,
  debounceSec = 0.2,
  safetySec = 12,
}: ProvidersProps) {
  const resolvedDebounceMs = useMemo(
    () => Math.max(0, Math.round((typeof debounceSec === "number" ? debounceSec : 0.2) * 1000)),
    [debounceSec]
  );
  const resolvedSafetyMs = useMemo(
    () => Math.max(0, Math.round((typeof safetySec === "number" ? safetySec : 60) * 1000)),
    [safetySec]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(0);

  const activeCountRef = useRef(0);
  const showTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const startSafetyTimer = useCallback(() => {
    clearSafetyTimer();
    safetyTimerRef.current = window.setTimeout(() => {
      activeCountRef.current = 0;
      clearShowTimer();
      clearSafetyTimer();
      setIsLoading(false);
      setMessage(null);
      setActiveCount(0);
    }, resolvedSafetyMs);
  }, [resolvedSafetyMs, clearSafetyTimer, clearShowTimer]);

  const show = useCallback(
    (msg?: string) => {
      activeCountRef.current += 1;
      setActiveCount(activeCountRef.current);
      if (msg) setMessage(msg);

      if (activeCountRef.current === 1) {
        clearShowTimer();
        showTimerRef.current = window.setTimeout(() => {
          setIsLoading(true);
          showTimerRef.current = null;
          startSafetyTimer();
        }, resolvedDebounceMs);
      } else {
        startSafetyTimer();
      }
    },
    [resolvedDebounceMs, clearShowTimer, startSafetyTimer]
  );

  const hide = useCallback(() => {
    activeCountRef.current = Math.max(0, activeCountRef.current - 1);
    setActiveCount(activeCountRef.current);

    if (activeCountRef.current === 0) {
      if (showTimerRef.current) {
        clearShowTimer();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      setMessage(null);
      clearSafetyTimer();
    }
  }, [clearShowTimer, clearSafetyTimer]);

  const reset = useCallback(() => {
    activeCountRef.current = 0;
    setActiveCount(0);
    clearShowTimer();
    clearSafetyTimer();
    setIsLoading(false);
    setMessage(null);
  }, [clearShowTimer, clearSafetyTimer]);

  const setLoading = useCallback(
    (loading: boolean, msg?: string) => {
      if (loading) show(msg);
      else hide();
    },
    [show, hide]
  );

  useEffect(() => {
    return () => {
      clearShowTimer();
      clearSafetyTimer();
      activeCountRef.current = 0;
    };
  }, [clearShowTimer, clearSafetyTimer]);

  return (
    <LoadingContext.Provider
      value={{ show, hide, setLoading, reset, isLoading, message }}
    >
      {children}
      {isLoading && <LoadingOverlay message={message ?? undefined} count={activeCount} />}
    </LoadingContext.Provider>
  );
}

export default LoadingProvider;