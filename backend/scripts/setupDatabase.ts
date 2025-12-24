import { getDb } from "../utils/db.js";
import chalk from "chalk";

const sql = getDb();

/**
 * createTables()
 * --------------------------------------------------------------------
 * Cria as tabelas principais do sistema:
 *   - Users
 *   - Accounts
 *
 * Ambas são criadas somente se ainda não existirem (`IF NOT EXISTS`).
 * Isso permite executar o script múltiplas vezes sem causar erro.
 *
 * A tabela Accounts possui foreign key vinculada à tabela Users,
 * com comportamento `ON DELETE CASCADE`, garantindo que ao remover
 * um usuário todas as contas relacionadas sejam automaticamente apagadas.
 */
export async function createTables() {
  console.log(chalk.cyan("\n🚀 Creating tables..."));

  /**
   * Tabela Users
   * ------------------------------------------------------------------
   * Estrutura:
   * - id: chave primária incremental (SERIAL)
   * - name: opcional
   * - email: obrigatório e único (UNIQUE NOT NULL)
   * - address: opcional
   * - password: obrigatório (apenas para o ambiente interno de testes)
   *
   * NOTA: Em produção real normalmente você não armazenaria
   * senhas diretamente — usaria hashing (bcrypt, argon2, etc).
   */
  await sql`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      address TEXT,
      password TEXT NOT NULL
    );
  `;

  /**
   * Tabela Accounts
   * ------------------------------------------------------------------
   * Estrutura:
   * - id: chave primária incremental
   * - userId: FK associada à tabela Users
   * - address: endereço associado à conta
   * - account: tipo de conta (Water, Energy, Gas, Internet)
   * - year, month: composição da data da fatura
   * - consumption: quantidade consumida no mês
   * - days: número de dias da fatura
   * - value: valor total a pagar
   * - paid: status (padrão = false)
   *
   * A relação: userId → Users(id) com ON DELETE CASCADE
   * garante integridade relacional e mantém o banco limpo.
   */
  await sql`
    CREATE TABLE IF NOT EXISTS Accounts (
      id SERIAL PRIMARY KEY,
      userId INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
      address TEXT,
      account TEXT NOT NULL,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      consumption FLOAT,
      days INTEGER,
      value FLOAT,
      paid BOOLEAN DEFAULT false
    );
  `;

  console.log(chalk.green("✅ Tables created!"));
}
