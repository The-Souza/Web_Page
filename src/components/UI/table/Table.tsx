import classNames from "classnames";
import type { TableProps } from "./Table.types";
import { useTableSort } from "./hook/useTableSort";

/**
 * Componente de tabela genérico.
 * @param param0 - Propriedades da tabela.
 * @returns Componente de tabela renderizado.
 */
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available",
  rowKey,
  defaultSort,
}: TableProps<T>) {
  // Hook personalizado para ordenação da tabela
  const { sortedData, sortKey, sortDirection, toggleSort } =
    useTableSort<T>({
      data,
      columns,
      defaultSort,
    });

  const iconClass = classNames("fas fa-caret-down ml-2 transition-transform", {
    "transform rotate-180": sortDirection === "asc",
  });

  return (
    <div className="w-full rounded-2xl border-2 border-greenLight bg-dark overflow-hidden">
      <div className="overflow-x-auto my-scroll">
        <table className="min-w-[800px] w-full text-center bg-dark">
          <thead className="uppercase text-sm font-raleway text-greenLight font-semibold bg-greenDark">
            <tr>
              {/* Cabeçalho da tabela */}
              {columns.map((col, index) => (
                <th
                  key={`th-${String(col.key)}-${index}`}
                  className={classNames(
                    "px-4 py-3 text-center",
                    col.sortable && "cursor-pointer select-none"
                  )}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                >
                  <div className="flex items-center justify-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <i className={iconClass} />  
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Corpo da tabela vazia */}
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-greenLight text-xl font-lato italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Corpo da tabela com dados
              sortedData.map((row, rowIndex) => {
                const key = rowKey ? String(rowKey(row)) : `row-${rowIndex}`;

                return (
                  <tr
                    key={key}
                    className="transition-colors border-t font-lato text-white border-greenLight/30 hover:bg-greenDark/30"
                  >
                    {/* Células da linha */}
                    {columns.map((col, colIndex) => {
                      const cellValue =
                        typeof col.key === "string" && col.key in row
                          ? row[col.key]
                          : undefined;

                      return (
                        <td
                          key={`td-${key}-${colIndex}`}
                          className={col.className ?? "px-4 py-3 text-center"}
                        >
                          {col.render
                            ? col.render(cellValue, row, rowIndex)
                            : String(cellValue ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
