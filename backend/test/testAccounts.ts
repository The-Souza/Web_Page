import {
  getAllAccounts,
  getAccountsByUserId,
  getAccountsByUserEmail,
} from "../services/account.service.ts";

export default async function testAccounts() {
  console.log("\n🔹 Testing getAllAccounts");
  const allAccounts = await getAllAccounts();
  console.log("💾 Total accounts:", allAccounts.length);

  console.log("\n🔹 Testing getAccountsByUserId for userId = 1");
  const userAccounts = await getAccountsByUserId(1);
  console.log("💾 User 1 accounts:", userAccounts.length);

  console.log("\n🔹 Testing getAccountsByUserEmail for user1@example.com");
  const emailAccounts = await getAccountsByUserEmail("user1@example.com");
  console.log("💾 Email accounts user1@example.com:", emailAccounts.length);
}
