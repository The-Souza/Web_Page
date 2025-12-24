import chalk from "chalk";
import { prettyPrint } from "../utils/logger.ts";
import dotenv from "dotenv";

// Carrega variáveis do arquivo .env para process.env
dotenv.config();

// Porta onde o servidor Express está rodando
const PORT = process.env.PORT;

/**
 * Função utilitária para exibir logs formatados e organizados.
 * Usa chalk para colorir o título e prettyPrint para formatação JSON.
 */
function prettyLog(label: string, data: object) {
  console.log(chalk.blue(`\n[${label}]`));
  console.log(prettyPrint(data));
}

/**
 * Testa rotas reais da API usando fetch.
 * 
 * Objetivo:
 *  - Validar se a API está devolvendo os dados esperados.
 *  - Ajudar no debug das rotas e controllers.
 *  - Conferir filtros, consultas e PATCH de atualização.
 *
 * Este script faz requisições HTTP diretas ao servidor Express.
 */
export default async function testRoutes() {
  //
  // 🔹 Buscar todos os usuários
  //
  const usersRes = await fetch(`http://localhost:${PORT}/api/users`);
  const users = await usersRes.json();
  prettyLog("Users", users);

  //
  // 🔹 Buscar todas as contas (sem filtro)
  //
  const accountsRes = await fetch(`http://localhost:${PORT}/api/accounts`);
  const accounts = await accountsRes.json();
  prettyLog("All Accounts", accounts);

  //
  // 🔹 Buscar contas do usuário de ID 1
  //
  const userIdRes = await fetch(`http://localhost:${PORT}/api/accounts/user/1`);
  const userAccounts = await userIdRes.json();
  prettyLog("User accounts 1", userAccounts);

  //
  // 🔹 Buscar contas pelo e-mail user1@example.com
  //
  const emailRes = await fetch(
    `http://localhost:${PORT}/api/accounts/email/user1@example.com`
  );
  const emailAccounts = await emailRes.json();
  prettyLog("Email accounts user1@example.com", emailAccounts);

  //
  // 🔹 Buscar contas do usuário 1 filtrando APENAS as pagas
  //    Exemplo: /api/accounts/user/1?paid=true
  //
  const userIdPaidRes = await fetch(
    `http://localhost:${PORT}/api/accounts/user/1?paid=true`
  );
  const userAccountsPaid = await userIdPaidRes.json();
  prettyLog("User accounts 1 (paid)", userAccountsPaid);

  //
  // 🔹 Buscar contas do usuário 1 filtrando APENAS as NÃO pagas
  //
  const userIdUnPaidRes = await fetch(
    `http://localhost:${PORT}/api/accounts/user/1?paid=false`
  );
  const userAccountsUnPaid = await userIdUnPaidRes.json();
  prettyLog("User accounts 1 (unpaid)", userAccountsUnPaid);

  //
  // 🔹 PATCH: Marcar a primeira conta do usuário 1 como paga
  //
  if (userAccounts.length > 0) {
    const first = userAccounts[0];

    const patchRes = await fetch(
      `http://localhost:${PORT}/api/accounts/${first.id}/paid`,
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
