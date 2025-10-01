import type { TableProps } from "./Table.types";

export function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-dark text-white rounded-lg">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-2 border-b">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-2">
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : String(row[col.accessor] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
