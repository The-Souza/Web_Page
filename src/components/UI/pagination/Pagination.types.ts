// Parâmetros esperados pelo hook usePagination
export interface UsePaginationParams<T> {
  // Lista completa de itens que serão paginados
  items: T[];

  // Quantidade de itens por página (padrão definido no hook)
  itemsPerPage?: number;

  // Quantidade de páginas visíveis na paginação (ex: 3 → mostra 1, 2, 3)
  visiblePages?: number;
}

// Props do componente Pagination
export interface PaginationProps<T> {
  // Lista completa de itens que o componente irá paginar
  items: T[];

  // Tamanho inicial da página (ex.: 10 itens por página ao carregar)
  initialPageSize?: number;

  // Callback opcional disparado sempre que a página ou o pageSize mudam,
  // útil para comunicação com o componente pai
  onPageChange?: (data: {
    currentPage: number;   // número da página atual
    itemsPerPage: number;  // tamanho atual da página
    startIndex: number;    // índice inicial no array original
    endIndex: number;      // índice final no array original
    paginatedItems: T[];   // itens da página atual
  }) => void;

  // Número de páginas visíveis no componente (ex.: 3, 5, 7...)
  visiblePages?: number;
}
