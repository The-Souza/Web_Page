import chalk from "chalk";
import { generateUsers, generateAccounts } from "./seedTables.ts";
import dropTables from "./dropTables.ts";
import { createTables } from "./setupDatabase.ts";
import { runStep } from "../utils/logger.ts";
import testAccounts from "../test/testAccounts.ts";
import testRoutes from "../test/testRoutes.ts";
import { tablesExist } from "../helpers/tablesExists.ts";

/**
 * seedDatabase()
 * ------------------------------------
 * Popula a base com dados iniciais (usuários e contas).
 * Antes disso, garante que as tabelas já tenham sido criadas.
 */
async function seedDatabase() {
  const exists = await tablesExist();

  // Se as tabelas não existem, não faz sentido tentar inserir dados
  if (!exists) {
    console.log(chalk.red("\n❌ Cannot seed database: tables do not exist."));
    console.log(chalk.yellow("➡️  Run: npm run setup\n"));
    process.exit(1);
  }

  await generateUsers();
  await generateAccounts();
}

/**
 * runTests()
 * ------------------------------------
 * Executa os testes internos (testAccounts e testRoutes).
 * Também exige que as tabelas já existam e estejam populadas.
 */
async function runTests() {
  const exists = await tablesExist();

  if (!exists) {
    console.log(chalk.red("\n❌ Cannot run tests: tables do not exist."));
    console.log(chalk.yellow("➡️  Run: npm run setup and npm run seed\n"));
    process.exit(1);
  }

  await testAccounts();
  await testRoutes();
}

/**
 * dropDatabase()
 * ------------------------------------
 * Remove as tabelas do banco de dados.
 * Só executa caso elas realmente existam, evitando erros desnecessários.
 */
async function dropDatabase() {
  const exists = await tablesExist();

  if (!exists) {
    console.log(chalk.yellow("\n❌ Cannot drop database: tables do not exist.\n"));
    process.exit(1);
  }

  await dropTables();
}

/**
 * setupDatabase()
 * ------------------------------------
 * Cria as tabelas do banco do zero.
 * Só roda se **não existir** nenhuma das tabelas, evitando sobrescritas acidentais.
 */
async function setupDatabase() {
  const exists = await tablesExist();

  if (exists) {
    console.log(chalk.yellow("\n❌ Cannot setup database: tables already exist.\n"));
    process.exit(1);
  }

  await createTables();
}

/**
 * main()
 * ------------------------------------
 * Script CLI principal.
 * Lê argumentos passados via terminal (ex: --seed, --setup).
 * Executa a rotina correspondente usando runStep(), que melhora logs e feedback visual.
 */
async function main() {
  // Pega argumentos após "node script.js"
  const args = process.argv.slice(2);

  // Lista de flags suportadas
  const validArgs = ["--seed", "--test", "--drop-db", "--setup"];

  // Filtra apenas argumentos válidos
  const activeArgs = args.filter((a) => validArgs.includes(a));

  // Tarefa principal (somente um argumento é usado)
  const task = activeArgs[0];

  switch (task) {
    case "--seed":
      try {
        await runStep("Seeding Database", seedDatabase);
        process.exit(0);
      } catch (err) {
        console.error("❌ Failed to seed tables:", err);
        process.exit(1);
      }
      break;

    case "--test":
      try {
        await runStep("Running Tests", runTests);
        process.exit(0);
      } catch (err) {
        console.error("❌ Tests failed:", err);
        process.exit(1);
      }
      break;

    case "--drop-db":
      try {
        await runStep("Dropping Tables", dropDatabase);
        process.exit(0);
      } catch (err) {
        console.error(chalk.red("❌ Failed to delete database:"), err);
        process.exit(1);
      }
      break;

    case "--setup":
      try {
        await runStep("Setup Database", setupDatabase);
        process.exit(0);
      } catch (err) {
        console.error("❌ Failed to setup database:", err);
        process.exit(1);
      }
      break;

    default:
      console.log(chalk.red("❌ Unknown option:", task));
      process.exit(1);
  }

  console.log(chalk.magenta("\n🎉 All tasks completed!"));
}

// Executa o script
main();
