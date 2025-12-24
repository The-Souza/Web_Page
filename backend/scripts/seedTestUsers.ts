import { getDb } from "../utils/db.js";
import chalk from "chalk";
import { faker } from "@faker-js/faker";

const sql = getDb();

/**
 * generateTestUsers()
 * --------------------------------------------------------------------
 * Gera uma lista de 2 usuários falsos (mock) usando faker e insere
 * cada um no banco de dados.
 *
 * A inserção usa ON CONFLICT(email) DO NOTHING para evitar duplicações
 * caso o seed seja executado mais de uma vez.
 */
export async function generateTestUsers() {
  console.log(chalk.cyan("\n👤 Generating test users..."));

  // Cria 2 usuários falsos
  const users = Array.from({ length: 2 }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    address: faker.location.streetAddress(),
    password: "123456", // Senha fixa apenas para ambiente de testes
  }));

  // Insere cada usuário individualmente
  for (const user of users) {
    await sql`
      INSERT INTO Users (name, email, address, password)
      VALUES (${user.name}, ${user.email}, ${user.address}, ${user.password})
      ON CONFLICT (email) DO NOTHING;
    `;
  }

  console.log(chalk.green("✅ Users inserted!"));
}

/**
 * generateConsumption()
 * --------------------------------------------------------------------
 * Retorna um valor de consumo coerente baseado no tipo da conta.
 * usado para criação de dados realistas para Water, Energy, Gas, Internet.
 */
const generateConsumption = (type: string) => {
  switch (type) {
    case "Water":
      return parseFloat((Math.random() * 30 + 10).toFixed(2));      // 10–40 m³
    case "Energy":
      return parseFloat((Math.random() * 500 + 100).toFixed(2));    // 100–600 kWh
    case "Gas":
      return parseFloat((Math.random() * 50 + 10).toFixed(2));      // 10–60 m³
    case "Internet":
      return parseFloat((Math.random() * 500 + 50).toFixed(2));     // 50–550 GB
    default:
      return parseFloat((Math.random() * 100).toFixed(2));
  }
};

/**
 * generateValue()
 * --------------------------------------------------------------------
 * Calcula o valor da conta baseado no tipo e consumo.
 * Simula regras diferentes de cobrança para cada utilidade.
 */
const generateValue = (type: string, consumption: number) => {
  switch (type) {
    case "Water":
      return parseFloat((consumption * 5).toFixed(2));
    case "Energy":
      return parseFloat((consumption * 0.9).toFixed(2));
    case "Gas":
      return parseFloat((consumption * 4).toFixed(2));
    case "Internet":
      return parseFloat((consumption * 0.2).toFixed(2));
    default:
      return consumption;
  }
};

/**
 * generateTestAccounts()
 * --------------------------------------------------------------------
 * Para cada usuário inserido anteriormente:
 *  - gera contas mensais de 2024 a 2025
 *  - para cada tipo: Water, Energy, Gas, Internet
 *  - gera consumo fake, valor, dias e status "paid" (sempre false)
 *
 * Faz insert em lote (batch insert) por usuário, usando:
 *  INSERT INTO Accounts (...) VALUES (...)
 * com sql(inserts.map(...))
 *
 * Isso é MUITO mais eficiente do que uma inserção por vez.
 */
export async function generateTestAccounts() {
  console.log(chalk.cyan("💳 Generating test monthly accounts..."));

  const accountsList = ["Water", "Energy", "Gas", "Internet"];
  const testUsers = ["user1@example.com", "user2@example.com"];

  // Busca usuários para gerar contas
  const users = await sql`SELECT id, address FROM Users WHERE email = ANY(${testUsers});`

  const startYear = 2024;
  const endYear = 2025;

  // Para cada usuário...
  for (const user of users) {
    const inserts = [];

    // Para cada tipo de conta (Water / Energy / Gas / Internet)
    for (const accountType of accountsList) {
      // Para cada ano e mês no intervalo configurado
      for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
          const consumption = generateConsumption(accountType);
          const value = generateValue(accountType, consumption);

          // Número de dias da fatura (28–31)
          const days = Math.floor(Math.random() * 4) + 28;

          // Acumula para inserção em lote
          inserts.push({
            userId: user.id,
            address: user.address,
            account: accountType,
            year,
            month,
            consumption,
            days,
            value,
            paid: false,
          });
        }
      }
    }

    /**
     * Inserção em lote para este usuário
     *
     * sql([...]) cria algo como:
     * (1, 'Rua X', 'Water', 2024, 1, 123, 30, 150, false),
     * (1, 'Rua X', 'Water', 2024, 2, 110, 28, 140, false),
     * ...
     */
    await sql`
      INSERT INTO Accounts (
        userId, address, account, year, month,
        consumption, days, value, paid
      ) VALUES 
        ${sql(
          inserts.map((acc) => [
            acc.userId,
            acc.address,
            acc.account,
            acc.year,
            acc.month,
            acc.consumption,
            acc.days,
            acc.value,
            acc.paid,
          ])
        )}
    `;
  }

  console.log(chalk.green("✅ Monthly accounts inserted!"));
}
