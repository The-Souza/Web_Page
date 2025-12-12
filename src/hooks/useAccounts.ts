import { useEffect, useState, useRef } from "react";
import type { Account } from "@/types/account.types";
import { useToast } from "@/providers/hook/useToast";
import { apiClient } from "@/services/ApiClient.service";

export function useAccounts(email?: string) {
  // 🔹 Hooks do Toast para mostrar e esconder mensagens
  const { showToast, hideToast } = useToast();

  // 🔹 Estado local para armazenar contas e loading
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ref para armazenar contas recentemente marcadas como pagas, agrupadas por tipo
  const pendingUpdates = useRef<{
    mode: "paid" | "unpaid" | null; // controla o grupo ativo
    paid: Record<string, string[]>; // grupos de contas marcadas como paid
    unpaid: Record<string, string[]>; // grupos de contas marcadas como unpaid
  }>({
    mode: null,
    paid: {},
    unpaid: {},
  });

  // 🔹 Timeout para consolidar toasts de várias atualizações em um único toast
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔹 Carrega contas do backend sempre que o email muda
  useEffect(() => {
    if (!email) return; // se não houver email, não faz nada
    setLoading(true);

    (async () => {
      // 🔹 Chamada ao apiClient para buscar contas do usuário
      const response = await apiClient<Account[]>(`/accounts/email/${email}`);

      if (response.success && response.data) {
        setAccounts(response.data); // atualiza estado com contas recebidas
      } else {
        // mostra erro caso a requisição falhe
        showToast({
          type: "error",
          title: "Error",
          text: response.message ?? "Unable to load accounts",
        });
      }

      setLoading(false); // desativa loading
    })();
  }, [email, showToast]);

  /**
   * 🔹 Marca uma conta como paga ou não paga
   * @param accountId ID da conta
   * @param paid Boolean indicando se a conta foi paga
   * @param accountType Tipo da conta (ex: Water, Energy)
   * @param accountLabel Nome/identificação da conta (ex: endereço)
   */
  const updatePaid = async (
    accountId: number,
    paid: boolean,
    accountType: string,
    accountLabel: string
  ) => {
    try {
      // 🔹 Atualiza o backend usando apiClient
      const response = await apiClient(`/accounts/${accountId}/paid`, {
        method: "PATCH",
        body: JSON.stringify({ paid }),
      });

      if (!response.success) throw new Error(response.message);

      // 🔹 Atualiza estado local para refletir a mudança
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === accountId ? { ...acc, paid } : acc))
      );

      // ---------------------------------------------
      // 🔥 LÓGICA DE AGRUPAMENTO MELHORADA
      // ---------------------------------------------

      const mode = paid ? "paid" : "unpaid";

      // 🔹 Se o modo mudou, limpamos TUDO do modo anterior
      if (pendingUpdates.current.mode && pendingUpdates.current.mode !== mode) {
        pendingUpdates.current.paid = {};
        pendingUpdates.current.unpaid = {};
        if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
      }

      pendingUpdates.current.mode = mode;

      hideToast();

      // 🔹 Adiciona no grupo correto (paid ou unpaid)
      const targetGroup =
        mode === "paid"
          ? pendingUpdates.current.paid
          : pendingUpdates.current.unpaid;

      if (!targetGroup[accountType]) targetGroup[accountType] = [];
      targetGroup[accountType].push(accountLabel);

      // 🔹 Reinicia timeout
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);

      pendingTimeout.current = setTimeout(() => {
        const group =
          pendingUpdates.current.mode === "paid"
            ? pendingUpdates.current.paid
            : pendingUpdates.current.unpaid;

        const lines = Object.entries(group)
          .map(([type, labels]) => `• ${type}: ${labels.join(", ")}`)
          .join("\n");

        // 🔹 Exibe o toast final consolidado
        showToast({
          type: "success",
          title:
            pendingUpdates.current.mode === "paid"
              ? "Accounts marked as paid"
              : "Accounts marked as unpaid",
          text: lines,
        });

        // 🔹 Limpa tudo após exibir
        pendingUpdates.current.paid = {};
        pendingUpdates.current.unpaid = {};
        pendingUpdates.current.mode = null;
        pendingTimeout.current = null;
      }, 1500);
    } catch {
      // 🔹 Mostra toast de erro caso algo dê errado
      showToast({
        type: "error",
        title: "Error",
        text: "Unable to update account",
      });
    }
  };

  // 🔹 Retorna dados e funções para o componente consumir
  return { accounts, loading, updatePaid, setAccounts };
}
