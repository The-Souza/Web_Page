/**
 * Normaliza o mês para o formato MM/YYYY.
 *
 * Essa função garante consistência no formato do mês,
 * evitando problemas de ordenação, comparação e exibição
 * quando o valor vem como "1", "2", etc.
 *
 * Exemplo:
 *  - ("3", 2024)  → "03/2024"
 *  - ("11", 2025) → "11/2025"
 */
export function normalizeMonth(month: string, year: string | number): string {
  const paddedMonth = String(month).padStart(2, "0");
  return `${paddedMonth}/${year}`;
}
