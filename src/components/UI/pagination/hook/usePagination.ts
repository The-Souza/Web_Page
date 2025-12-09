import { useState, useMemo, useCallback } from "react";
import type { UsePaginationParams } from "../Pagination.types";

export function usePagination<T>({
  items,
  itemsPerPage = 5,
  visiblePages = 3,
}: UsePaginationParams<T>) {
  // Estado da página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Quantidade de itens exibidos por página
  const [pageSize, setPageSize] = useState(itemsPerPage);

  // Cálculo total de páginas (mínimo 1 para evitar divisão por zero)
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);

  // Intervalo de itens da página atual (start e end)
  const currentRange = useMemo(() => {
    // Índice inicial (ex.: página 1 → 0)
    const start = (currentPage - 1) * pageSize;

    // Índice final limitado ao tamanho do array
    const end = Math.min(currentPage * pageSize, items.length);

    return { start, end };
  }, [currentPage, pageSize, items.length]);

  // Slice dos itens da página atual
  const paginatedItems = useMemo(() => {
    return items.slice(currentRange.start, currentRange.end);
  }, [items, currentRange.start, currentRange.end]);

  // Números de páginas visíveis no componente (ex.: mostrar 3 → [4,5,6])
  const visiblePageNumbers = useMemo(() => {
    // Metade da quantidade (para centralizar a página atual)
    const half = Math.floor(visiblePages / 2);

    // Começo das páginas visíveis
    let start = Math.max(currentPage - half, 1);

    // Fim das páginas visíveis, respeitando limite do total
    const end = Math.min(start + visiblePages - 1, totalPages);

    // Ajuste quando o número de páginas não preenche o total desejado
    if (end - start + 1 < visiblePages) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    // Cria o array de páginas (ex.: 3 páginas → [5,6,7])
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, visiblePages]);

  // Função para mudar de página (garantindo limites)
  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.min(Math.max(1, page), totalPages));
    },
    [totalPages]
  );

  // Altera a quantidade de itens por página e retorna para página 1
  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    currentPage,        // número da página atual
    totalPages,         // total de páginas disponíveis
    pageSize,           // quantidade atual de itens por página
    visiblePageNumbers, // páginas que serão exibidas no componente
    currentRange,       // intervalos de índice atual (start/end)
    paginatedItems,     // subset da página atual
    goToPage,           // função para navegar entre páginas
    changePageSize,     // função para alterar pageSize
  };
}
