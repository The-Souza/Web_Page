import classNames from "classnames";
import type { TableProps } from "./Table.types";

export function Table<T>({
  columns,
  data,
  emptyMessage = "No data available",
  rowKey,
}: TableProps<T>) {
  // Classes do elemento <table>
  const tableClass = classNames(
    "w-full text-center overflow-hidden bg-dark"
  );

  // Classes do container que envolve a tabela (scroll horizontal)
  const wrapperClass = classNames(
    "overflow-x-auto w-full rounded-2xl border-2 border-greenLight"
  );

  return (
    <div className={wrapperClass}>
      <table className={tableClass}>
        {/* Cabeçalho da tabela */}
        <thead className="uppercase text-sm font-raleway text-greenLight font-semibold bg-greenDark">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3">
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
                  className="transition-colors border-t font-lato text-white border-greenLight/30"
                >
                  {columns.map((col) => {
                    const cellValue = row[col.key];
                    return (
                      <td
                        key={String(col.key)}
                        className={col.className ?? "px-4 py-3"} // classes personalizadas ou padrão
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
  );
}
