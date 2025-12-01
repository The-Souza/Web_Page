import type { ReactNode } from "react";

/**
 * TableColumn
 * ------------------------------------------------------------
 * Define a configuração de cada coluna da tabela.
 *
 * Generics:
 * - T: tipo do objeto da linha.
 * - K: chave de T que será usada para a coluna (default: todas as chaves de T).
 */
export interface TableColumn<T, K extends keyof T = keyof T> {
  key: K; // chave do objeto da linha que a coluna irá exibir
  label: string; // texto do cabeçalho da coluna
  render?: (value: T[K], row: T) => ReactNode; 
  // função opcional para renderização customizada do valor da célula
  className?: string; // classes CSS opcionais para a célula
}

/**
 * TableProps
 * ------------------------------------------------------------
 * Propriedades do componente Table.
 */
export interface TableProps<T> {
  columns: TableColumn<T>[]; // lista de colunas
  data: T[]; // dados da tabela (linhas)
  emptyMessage?: string; // mensagem quando não há dados
  className?: string; // classes CSS opcionais para o container da tabela
  rowKey?: (row: T) => string | number; 
  // função para gerar chave única de cada linha (evita usar índice)
}
