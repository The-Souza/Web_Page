import {
  getAllAccounts,
  getAccountsByUserId,
  getAccountsByUserEmail,
  updateAccountPaid,
} from "../services/account.service.ts";
import chalk from "chalk";

function prettyLog(label: string, data: object) {
  console.log(chalk.blue(`\n[${label}]`));
  console.dir(data, { depth: null, colors: true });
}

export default async function testAccounts() {
  console.log(chalk.magenta("\n=== Testing Accounts Services ==="));

  // 🔹 getAllAccounts
  console.log("\n🔹 Testing getAllAccounts()");
  const allAccounts = await getAllAccounts();
  console.log("💾 Total accounts:", allAccounts.length);

  // 🔹 getAccountsByUserId
  console.log("\n🔹 Testing getAccountsByUserId for userId = 1");
  const userAccounts = await getAccountsByUserId(1);
  console.log("💾 User 1 accounts:", userAccounts.length);

  // 🔹 getAccountsByUserEmail
  console.log("\n🔹 Testing getAccountsByUserEmail for user1@example.com");
  const emailAccounts = await getAccountsByUserEmail("user1@example.com");
  console.log("💾 Email accounts user1@example.com:", emailAccounts.length);

  // 🔹 updateAccountPaid
  if (userAccounts.length > 0) {
    const first = userAccounts[0];
    console.log(chalk.cyan(`\n🔹 Marking account ID=${first.id} as paid...`));
    await updateAccountPaid(first.id!, true);

    // Buscar novamente para ver se atualizou
    const updated = await getAccountsByUserId(1);
    const updatedFirst = updated.find((acc) => acc.id === first.id);

    prettyLog("Updated account", updatedFirst || {});
    console.log(
      chalk.green(`\n✅ Account ID=${first.id} updated to paid=true!`)
    );
  } else {
    console.log(chalk.yellow("\n⚠️  No account found for userId=1"));
  }
}
