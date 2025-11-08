import { useEffect, useState } from "react";
import type { Account } from "@/types/account.types";
import { useToast } from "@/components/providers/hook/useToast";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useAccounts(email?: string) {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

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

  const updatePaid = async (accountId: number, paid: boolean) => {
    try {
      await fetch(`${BASE_URL}/accounts/${accountId}/paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid }),
      });

      setAccounts((prev) =>
        prev.map((acc) => (acc.id === accountId ? { ...acc, paid } : acc))
      );

      showToast({
        type: "success",
        title: "Account updated",
        text: `Account marked as ${paid ? "paid" : "not paid"}`,
      });
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
