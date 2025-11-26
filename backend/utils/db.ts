import dotenv from "dotenv";
import postgres from "postgres";

// Carrega variáveis do arquivo .env para process.env
// Necessário para acessar DATABASE_URL
dotenv.config();

/**
 * Instância principal do cliente PostgreSQL usando a lib 'postgres'
 * 
 * - process.env.DATABASE_URL → URL completa de conexão fornecida pelo Supabase
 * - ssl: "require" → Supabase exige conexão com SSL habilitado
 * 
 * Essa instância (`sql`) é usada em todo o projeto para fazer queries:
 *   await sql`SELECT * FROM Users`;
 */
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

/**
 * Função utilitária para testar a conexão com o banco.
 *
 * Objetivo:
 *  - Garantir que o backend realmente consegue conectar no PostgreSQL
 *  - Logar sucesso ou erro quando o servidor inicia
 *
 * Se a conexão falhar, o erro é lançado para impedir que a aplicação continue.
 */
export async function getConnection() {
  try {
    // Executa uma query simples só para testar comunicação
    await sql`SELECT NOW()`;

    console.log("✅ Connected to Supabase PostgreSQL!");
  } catch (err) {
    console.error("❌ Failed to connect to Supabase:", err);
    throw err; // impede continuar a inicialização
  }
}
