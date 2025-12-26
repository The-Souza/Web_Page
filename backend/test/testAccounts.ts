import {
  getAllAccounts,
  getAccountsByUserEmail,
  updateAccountPaid,
} from "../services/account.service.js";
import chalk from "chalk";
import { prettyLog } from "../utils/logger.js";

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
  // 🔹 Teste: getAccountsByUserEmail()
  //
  console.log("\n🔹 Testing getAccountsByUserEmail for user1@example.com");
  const emailAccounts = await getAccountsByUserEmail("user1@example.com");
  console.log("💾 Email accounts user1@example.com:", emailAccounts.length);

  //
  // 🔹 Teste: updateAccountPaid()
  // Atualiza a primeira conta como paga e lê novamente para conferir.
  //
  if (emailAccounts.length > 0) {
    const first = emailAccounts[0];

    console.log(chalk.cyan(`\n🔹 Marking account ID=${first.id} as paid...`));

    // Marca como paga no banco
    await updateAccountPaid(first.id!, true);

    // Busca novamente contas do usuário para confirmar a mudança
    const updated = await getAccountsByUserEmail("user1@example.com");
    const updatedFirst = updated.find((acc) => acc.id === first.id);

    // Exibe o registro atualizado em formato legível
    prettyLog("Updated account", updatedFirst || {});

    console.log(
      chalk.green(`\n✅ Account ID=${first.id} updated to paid=true!`)
    );
  }
}
