import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePagination } from "./hook/usePagination";
import type { PaginationProps } from "./Pagination.types";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import classNames from "classnames";

export function Pagination<T>({
  items,
  initialPageSize = 10,
  visiblePages = 3,
  onPageChange,
}: PaginationProps<T>) {
  // Hook de paginação centralizado, isolando toda lógica (SRP)
  const {
    currentPage, // página atual
    totalPages, // total de páginas
    pageSize, // quantidade de itens por página
    visiblePageNumbers, // números de página exibidos (ex: 3 → 1, 2, 3)
    currentRange, // índices inicial e final dos itens exibidos
    paginatedItems, // fatia dos itens da página atual
    goToPage, // função para mudar de página
    changePageSize, // função para alterar o tamanho da página
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

  const isMobile = useMediaQuery("(max-width: 640px)");

  // Ajusta o tamanho da página para 5 itens em telas móveis
  useEffect(() => {
    if (isMobile && pageSize !== 5) {
      changePageSize(5);
    }
  }, [isMobile, pageSize, changePageSize]);

  return (
    <div className="flex flex-col sm:flex-row items-center md:justify-between lg:justify-end w-full h-10 gap-4">
      {/* -------------------------------------------- */}
      {/* BLOCO ESQUERDO — informações + seletor de itens */}
      {/* -------------------------------------------- */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Label do seletor */}
        <p className="text-textColor font-raleway text-md">Items per page:</p>

        {/* Select para escolher quantos itens aparecem por página */}
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          className="w-[5.5rem] h-10 px-4 bg-bgComponents text-textColor border-2
          border-primary rounded-lg font-lato font-semibold cursor-pointer hover:ring-1
          hover:ring-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
        >
          {/* Opções padrão */}
          {[5, 10, 25, 50, 100].map((n) => (
            <option
              key={n}
              value={n}
              className="bg-bgComponents text-textColor"
            >
              {n}
            </option>
          ))}
        </select>

        {/* Informação do range exibido */}
        <p className="text-textColor font-raleway text-md">
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
          className={classNames(
            "pagination-btn w-10 h-10 bg-bgComponents rounded-l-lg flex text-textColor items-center justify-center border-l-2 border-y-2 border-r border-primary font-semibold",
            {
              "opacity-50 cursor-not-allowed": currentPage === 1,
              "hover:bg-buttonSolidHover active:bg-primary": currentPage !== 1,
            }
          )}
        >
          <ChevronsLeft size={28} />
        </button>

        {/* Página anterior */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={classNames(
            "pagination-btn w-10 h-10 bg-bgComponents text-textColor flex items-center justify-center border-y-2 border-x border-primary font-semibold",
            {
              "opacity-50 cursor-not-allowed": currentPage === 1,
              "hover:bg-buttonSolidHover active:bg-primary": currentPage !== 1,
            }
          )}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Botões numéricos das páginas visíveis */}
        {visiblePageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => goToPage(n)}
            className={`w-10 h-10 flex items-center justify-center border-y-2 border-x border-primary font-semibold transition ${
              n === currentPage
                ? "bg-primary text-textColor" // página ativa
                : "bg-bgComponents text-textColor hover:bg-buttonSolidHover" // outras páginas
            }`}
          >
            {n}
          </button>
        ))}

        {/* Próxima página */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={classNames(
            "pagination-btn bg-bgComponents w-10 h-10 text-textColor flex items-center justify-center border-y-2 border-x border-primary font-semibold",
            {
              "opacity-50 cursor-not-allowed": currentPage === totalPages,
              "hover:bg-buttonSolidHover active:bg-primary": currentPage !== totalPages,
            }
          )}
        >
          <ChevronRight size={28} />
        </button>

        {/* Ir para a última página */}
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className={classNames(
            "pagination-btn w-10 h-10 bg-bgComponents text-textColor rounded-r-lg flex items-center justify-center border-r-2 border-y-2 border-l border-primary font-semibold",
            {
              "opacity-50 cursor-not-allowed": currentPage === totalPages,
              "hover:bg-transparent active:bg-primary": currentPage !== totalPages,
            }
          )}
        >
          <ChevronsRight size={28} />
        </button>
      </div>
    </div>
  );
}
