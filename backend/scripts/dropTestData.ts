import { sql } from "../utils/db.ts";
import chalk from "chalk";

/**
 * dropTestData()
 * ------------------------------------
 * Remove usuários de teste e todas as contas associadas a eles.
 * Seguro para ambiente de desenvolvimento.
 */
export default async function dropTestData() {
  console.log(chalk.yellow("\n⚠️  Deleting test users and accounts..."));

  try {
    const testEmails = ["user1@example.com", "user2@example.com"];

    // 🔹 Remove contas associadas aos usuários de teste
    await sql`
      DELETE FROM Accounts a
      USING Users u
      WHERE a.userId = u.id
      AND u.email = ANY(${testEmails});
    `;

    // 🔹 Remove os usuários de teste
    await sql`
      DELETE FROM Users
      WHERE email = ANY(${testEmails});
    `;

    console.log(chalk.green("✅ Test users and accounts deleted successfully!"));
  } catch (err) {
    console.error(chalk.red("❌ Error deleting test data:"), err);
  }
}
