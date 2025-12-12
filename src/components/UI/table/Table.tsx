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
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3 text-center">
                  {col.label} {/* Label da coluna */}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              // Linha exibida quando não há dados
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-greenLight text-xl font-lato italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Renderização das linhas de dados
              data.map((row, rowIndex) => {
                const key = rowKey ? rowKey(row) : String(rowIndex); // chave da linha
                return (
                  <tr
                    key={key}
                    className="transition-colors border-t font-lato text-white border-greenLight/30 hover:bg-greenDark/30"
                  >
                    {columns.map((col) => {
                      const cellValue =
                        typeof col.key === "string" && col.key in row
                          ? row[col.key]
                          : undefined;
                      return (
                        <td
                          key={String(col.key)}
                          className={col.className ?? "px-4 py-3 text-center"} // classes personalizadas ou padrão
                        >
                          {/* Renderiza usando função personalizada ou valor padrão */}
                          {col.render
                            ? col.render(cellValue, row)
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
