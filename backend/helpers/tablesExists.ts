import { getDb } from "../utils/getDb.js";

/**
 * Verifica se as tabelas essenciais ('users' e 'accounts') existem no schema público.
 *
 * 🔍 Para que serve?
 * - Impede rodar seed/test/drop antes das tabelas existirem
 * - Garante que o ambiente do banco está preparado
 * - Ajuda a evitar erros silenciosos nas operações
 *
 * @returns true se **ambas** as tabelas existirem, false caso contrário
 */
export async function tablesExist() {
  const sql = getDb();
  // Consulta o catálogo do banco para verificar a existência das tabelas
  const result = await sql`
    SELECT table_name 
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('users', 'accounts');
  `;

  // Só retorna true se as 2 tabelas foram encontradas
  return result.length === 2;
}
