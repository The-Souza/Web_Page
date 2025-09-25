import chalk from "chalk";
import { prettyPrint } from "../utils/logger.ts";

function prettyLog(label: string, data: object) {
  console.log(chalk.blue(`\n[${label}]`));
  console.log(prettyPrint(data));
}

export default async function testRoutes() {
  const usersRes = await fetch("http://localhost:5000/users");
  const users = await usersRes.json();
  prettyLog("Usuários", users);

  const accountsRes = await fetch("http://localhost:5000/accounts");
  const accounts = await accountsRes.json();
  prettyLog("Contas", accounts);

  const userIdRes = await fetch("http://localhost:5000/accounts/user/1");
  const userAccounts = await userIdRes.json();
  prettyLog("Contas do usuário 1", userAccounts);

  const emailRes = await fetch(
    "http://localhost:5000/accounts/email/user1@example.com"
  );
  const emailAccounts = await emailRes.json();
  prettyLog("Contas do email user1@example.com", emailAccounts);
}
