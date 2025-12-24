import postgres from "postgres";

/**
 * Singleton para conexão com o banco de dados PostgreSQL.
 * Usa a variável de ambiente DATABASE_URL para conexão.
 * Configura SSL obrigatório para conexões seguras.
 */
let sql: ReturnType<typeof postgres> | null = null;

/**
 * Retorna a instância singleton do cliente PostgreSQL.
 * @returns Instância do cliente PostgreSQL configurado.
 */
export function getDb() {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL!, {
      ssl: "require",
    });
  }

  return sql;
}
