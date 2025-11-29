import { useEffect, useState, useRef } from "react";
import type { Account } from "@/types/account.types";
import { useToast } from "@/providers/hook/useToast";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useAccounts(email?: string) {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Mapa de contas recentemente marcadas como pagas por tipo
  const pendingPaidUpdates = useRef<Record<string, string[]>>({});
  // 🔹 Timeout para consolidar o toast
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔹 Carrega contas do backend
  useEffect(() => {
    if (!email) return;
    setLoading(true);

    fetch(`${BASE_URL}/accounts/email/${email}`)
      .then((res) => res.json())
      .then((data: Account[]) => setAccounts(data))
      .catch(() =>
        showToast({
          type: "error",
          title: "Error",
          text: "Unable to load accounts",
        })
      )
      .finally(() => setLoading(false));
  }, [email, showToast]);

  // 🔹 Marca uma conta como paga ou não paga
  const updatePaid = async (accountId: number, paid: boolean, accountType: string, accountLabel: string) => {
    try {
      await fetch(`${BASE_URL}/accounts/${accountId}/paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid }),
      });

      setAccounts((prev) =>
        prev.map((acc) => (acc.id === accountId ? { ...acc, paid } : acc))
      );

      // Limpa o toast antigo se estiver visível
      // hideToast();

      // Adiciona a conta ao mapa de updates
      if (!pendingPaidUpdates.current[accountType]) pendingPaidUpdates.current[accountType] = [];
      pendingPaidUpdates.current[accountType].push(accountLabel);

      // Reinicia o timeout para consolidar o toast
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
      pendingTimeout.current = setTimeout(() => {
        // Monta o texto do toast agrupando por tipo
        const textLines = Object.entries(pendingPaidUpdates.current).map(
          ([type, labels]) => `- ${type}: ${labels.join(", ")}`
        );

        showToast({
          type: "success",
          title: "Account(s) marked as paid",
          text: textLines.join("\n"),
        });

        // Limpa o estado
        pendingPaidUpdates.current = {};
        pendingTimeout.current = null;
      }, 1500); // delay para agrupar várias contas
    } catch {
      showToast({
        type: "error",
        title: "Error",
        text: "Unable to update account",
      });
    }
  };

  return { accounts, loading, updatePaid };
}
