import classNames from "classnames";
import type { TableProps } from "./Table.types";

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available",
  rowKey,
}: TableProps<T>) {
  // Wrapper externo — mantém o rounded e a borda
  const outerWrapperClass = classNames(
    "w-full rounded-2xl border-2 border-greenLight bg-dark overflow-hidden"
  );

  // Wrapper interno — controla apenas o scroll
  const scrollWrapperClass = classNames("overflow-x-auto my-scroll");

  const tableClass = classNames("min-w-[800px] w-full text-center bg-dark");

  return (
    <div className={outerWrapperClass}>
      <div className={scrollWrapperClass}>
        <table className={tableClass}>
          {/* Cabeçalho da tabela */}
          <thead className="uppercase text-sm font-raleway text-greenLight font-semibold bg-greenDark">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={`th-${String(col.key)}-${index}`}
                  className="px-4 py-3 text-center"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr key="empty-row">
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-greenLight text-xl font-lato italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const key = rowKey ? String(rowKey(row)) : `row-${rowIndex}`;

                return (
                  <tr
                    key={key}
                    className="transition-colors border-t font-lato text-white border-greenLight/30 hover:bg-greenDark/30"
                  >
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
