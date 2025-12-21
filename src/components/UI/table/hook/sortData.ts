/**
 * Ordena um array de objetos com base em uma chave específica.
 * @param data - Array de dados a serem ordenados
 * @param key - Chave do objeto a ser usada para ordenação
 * @param direction - Direção da ordenação ("asc" ou "desc")
 * @param type - Tipo de dados ("string", "number", "boolean")
 * @returns Array ordenado
 */
export function sortData<T extends Record<string, unknown>>(
  data: T[],
  key: keyof T,
  direction: "asc" | "desc",
  type: "string" | "number" | "boolean" = "string"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal == null || bVal == null) return 0;

    let result = 0;

    switch (type) {
      case "number":
        result = Number(aVal) - Number(bVal);
        break;

      case "boolean":
        result = Number(aVal) - Number(bVal);
        break;

      case "string":
      default:
        result = String(aVal).localeCompare(String(bVal));
        break;
    }

    return direction === "asc" ? result : -result;
  });
}
