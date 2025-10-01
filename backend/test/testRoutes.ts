import chalk from "chalk";
import { prettyPrint } from "../utils/logger.ts";

const PORT = 5000;

function prettyLog(label: string, data: object) {
  console.log(chalk.blue(`\n[${label}]`));
  console.log(prettyPrint(data));
}

export default async function testRoutes() {
  // 🔹 Usuários
  const usersRes = await fetch(`http://localhost:${PORT}/users`);
  const users = await usersRes.json();
  prettyLog("Users", users);

  // 🔹 Todas as contas
  const accountsRes = await fetch(`http://localhost:${PORT}/accounts`);
  const accounts = await accountsRes.json();
  prettyLog("All Accounts", accounts);

  // 🔹 Contas do usuário 1
  const userIdRes = await fetch(`http://localhost:${PORT}/accounts/user/1`);
  const userAccounts = await userIdRes.json();
  prettyLog("User accounts 1", userAccounts);
  
  // 🔹 Contas do email user1@example.com
  const emailRes = await fetch(
    `http://localhost:${PORT}/accounts/email/user1@example.com`
  );
  const emailAccounts = await emailRes.json();
  prettyLog("Email accounts user1@example.com", emailAccounts);
  
    // 🔹 Contas do usuário 1 filtrando só as pagas
    const userIdPaidRes = await fetch(
      `http://localhost:${PORT}/accounts/user/1?paid=true`
    );
    const userAccountsPaid = await userIdPaidRes.json();
    prettyLog("User accounts 1 (paid)", userAccountsPaid);

  // 🔹 Contas do email 1 filtrando só as não pagas
  const userIdUnPaidRes = await fetch(
    `http://localhost:${PORT}/accounts/user/1?paid=false`
  );
  const userAccountsUnPaid = await userIdUnPaidRes.json();
  prettyLog("User accounts 1 (unpaid)", userAccountsUnPaid);

  // 🔹 PATCH para marcar a primeira conta do user 1 como paga
  if (userAccounts.length > 0) {
    const first = userAccounts[0];
    const patchRes = await fetch(
      `http://localhost:${PORT}/accounts/${first.id}/paid`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true }),
      }
    );
    const patchData = await patchRes.json();
    prettyLog("PATCH response", patchData);
  }
}
