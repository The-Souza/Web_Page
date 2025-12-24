import { useMemo, useState } from "react";
import type { SortDirection, UseTableSortProps } from "../Table.types";
import { sortData } from "./sortData";

/**
 * Hook para gerenciar a ordenação de dados em uma tabela.
 * @param param0 - Parâmetros do hook.
 * @returns Objeto com os dados ordenados e funções para manipular a ordenação.
 */
export function useTableSort<T extends Record<string, unknown>>({
  data,
  columns,
  defaultSort,
}: UseTableSortProps<T>) {
  // Estado para a chave e direção de ordenação
  const [sortKey, setSortKey] = useState<string | null>(
    defaultSort?.key?.toString() ?? null
  );

  // Estado para a direção de ordenação
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    defaultSort?.direction ?? "asc"
  );

  // Dados ordenados memoizados
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const column = columns.find((c) => c.key === sortKey);
    if (!column || !column.sortable) return data;

    return sortData(data, sortKey, sortDirection, column.sortType ?? "string");
  }, [data, columns, sortKey, sortDirection]);

  // Função para alternar a ordenação
  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  return {
    sortedData,
    sortKey,
    sortDirection,
    toggleSort,
  };
}
