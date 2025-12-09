import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePagination } from "./hook/usePagination";
import type { PaginationProps } from "./Pagination.types";
import { useEffect } from "react";

export function Pagination<T>({
  items,
  initialPageSize = 10,
  visiblePages = 3,
  onPageChange,
}: PaginationProps<T>) {
  // Hook de paginação centralizado, isolando toda lógica (SRP)
  const {
    currentPage,         // página atual
    totalPages,          // total de páginas
    pageSize,            // quantidade de itens por página
    visiblePageNumbers,  // números de página exibidos (ex: 3 → 1, 2, 3)
    currentRange,        // índices inicial e final dos itens exibidos
    paginatedItems,      // fatia dos itens da página atual
    goToPage,            // função para mudar de página
    changePageSize,      // função para alterar o tamanho da página
  } = usePagination<T>({
    items,
    itemsPerPage: initialPageSize,
    visiblePages,
  });

  // useEffect evita setState sincronizado no componente pai
  // e notifica mudanças de paginação sempre que necessário
  useEffect(() => {
    onPageChange?.({
      currentPage,
      itemsPerPage: pageSize,
      startIndex: currentRange.start,
      endIndex: currentRange.end,
      paginatedItems,
    });
  }, [currentPage, pageSize, currentRange, paginatedItems, onPageChange]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-end w-full h-10 gap-4">
      {/* -------------------------------------------- */}
      {/* BLOCO ESQUERDO — informações + seletor de itens */}
      {/* -------------------------------------------- */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Label do seletor */}
        <p className="text-greenLight font-raleway text-md">Items per page:</p>

        {/* Select para escolher quantos itens aparecem por página */}
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          className="w-[5.5rem] h-10 px-4 bg-dark text-white border-2
          border-greenLight rounded-lg font-lato font-semibold cursor-pointer hover:ring-1
          hover:ring-greenLight focus:outline-none focus:ring-1 focus:ring-greenLight transition"
        >
          {/* Opções padrão */}
          {[5, 10, 25, 50, 100].map((n) => (
            <option key={n} value={n} className="bg-dark text-white">
              {n}
            </option>
          ))}
        </select>

        {/* Informação do range exibido */}
        <p className="text-greenLight font-raleway text-md">
          {currentRange.start + 1} - {currentRange.end} de {items.length}
        </p>
      </div>

      {/* -------------------------------------------- */}
      {/* BLOCO DIREITO — botões de paginação */}
      {/* -------------------------------------------- */}
      <div className="flex items-center">
        {/* Ir para a primeira página */}
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="pagination-btn w-10 h-10 bg-dark rounded-l-lg flex hover:bg-greenDark active:bg-greenMid text-white items-center justify-center border-l-2 border-y-2 border-r border-greenLight font-semibold"
        >
          <ChevronsLeft size={28} />
        </button>

        {/* Página anterior */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn w-10 h-10 bg-dark hover:bg-greenDark active:bg-greenMid text-white flex items-center justify-center border-y-2 border-x border-greenLight font-semibold"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Botões numéricos das páginas visíveis */}
        {visiblePageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => goToPage(n)}
            className={`w-10 h-10 flex items-center justify-center border-y-2 border-x border-greenLight font-semibold transition ${
              n === currentPage
                ? "bg-greenMid text-white" // página ativa
                : "bg-dark text-white hover:bg-greenDark" // outras páginas
            }`}
          >
            {n}
          </button>
        ))}

        {/* Próxima página */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn bg-dark w-10 h-10 hover:bg-greenDark active:bg-greenMid text-white flex items-center justify-center border-y-2 border-x border-greenLight font-semibold"
        >
          <ChevronRight size={28} />
        </button>

        {/* Ir para a última página */}
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn w-10 h-10 bg-dark hover:bg-greenDark active:bg-greenMid text-white rounded-r-lg flex items-center justify-center border-r-2 border-y-2 border-l border-greenLight font-semibold"
        >
          <ChevronsRight size={28} />
        </button>
      </div>
    </div>
  );
}
