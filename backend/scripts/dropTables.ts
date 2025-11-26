import { sql } from "../utils/db.ts";
import chalk from "chalk";

/**
 * dropTables()
 * -----------------------------
 * Função utilitária usada apenas em ambiente de desenvolvimento.
 * Remove as tabelas principais do banco de dados (Users e Accounts)
 * usando DROP TABLE IF EXISTS para evitar erros caso já tenham sido deletadas.
 * 
 * CASCADE garante que chaves estrangeiras e dependências sejam removidas também.
 */
export default async function dropTables() {
  console.log(chalk.yellow("\n⚠️  Deleting database..."));

  try {
    // Remove tabela de contas primeiro (possui FK → Users)
    await sql`DROP TABLE IF EXISTS Accounts CASCADE;`;

    // Remove tabela de usuários
    await sql`DROP TABLE IF EXISTS Users CASCADE;`;

    console.log(chalk.green(`✅ completed successfully!`));
  } catch (err) {
    // Qualquer falha durante o DROP é registrada aqui
    console.error(chalk.red(`\n❌ Error :`), err);
  }
}
