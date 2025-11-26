import {
  getAllAccounts,
  getAccountsByUserId,
  getAccountsByUserEmail,
  updateAccountPaid,
} from "../services/account.service.ts";
import chalk from "chalk";

/**
 * Função utilitária para exibir objetos no terminal
 * com indentação, cores e profundidade completa.
 */
function prettyLog(label: string, data: object) {
  console.log(chalk.blue(`\n[${label}]`));
  console.dir(data, { depth: null, colors: true });
}

/**
 * Função principal usada para testar manualmente
 * todos os serviços relacionados às contas (Accounts).
 *
 * Ela executa operações reais contra o banco (via Supabase):
 *  - Buscar todas as contas
 *  - Buscar contas de um usuário pelo ID
 *  - Buscar contas de um usuário pelo e-mail
 *  - Atualizar o status "paid" de uma conta
 *
 * Útil para depuração e validação dos serviços.
 */
export default async function testAccounts() {
  console.log(chalk.magenta("\n=== Testing Accounts Services ==="));

  //
  // 🔹 Teste: getAllAccounts()
  //
  console.log("\n🔹 Testing getAllAccounts()");
  const allAccounts = await getAllAccounts();
  console.log("💾 Total accounts:", allAccounts.length);

  //
  // 🔹 Teste: getAccountsByUserId()
  //
  console.log("\n🔹 Testing getAccountsByUserId for userId = 1");
  const userAccounts = await getAccountsByUserId(1);
  console.log("💾 User 1 accounts:", userAccounts.length);

  //
  // 🔹 Teste: getAccountsByUserEmail()
  //
  console.log("\n🔹 Testing getAccountsByUserEmail for user1@example.com");
  const emailAccounts = await getAccountsByUserEmail("user1@example.com");
  console.log("💾 Email accounts user1@example.com:", emailAccounts.length);

  //
  // 🔹 Teste: updateAccountPaid()
  // Atualiza a primeira conta como paga e lê novamente para conferir.
  //
  if (userAccounts.length > 0) {
    const first = userAccounts[0];

    console.log(chalk.cyan(`\n🔹 Marking account ID=${first.id} as paid...`));

    // Marca como paga no banco
    await updateAccountPaid(first.id!, true);

    // Busca novamente contas do usuário para confirmar a mudança
    const updated = await getAccountsByUserId(1);
    const updatedFirst = updated.find((acc) => acc.id === first.id);

    // Exibe o registro atualizado em formato legível
    prettyLog("Updated account", updatedFirst || {});

    console.log(
      chalk.green(`\n✅ Account ID=${first.id} updated to paid=true!`)
    );
  } else {
    // Caso o DB não tenha contas para o usuário 1
    console.log(chalk.yellow("\n⚠️  No account found for userId=1"));
  }
}
