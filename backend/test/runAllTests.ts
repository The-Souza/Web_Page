import chalk from "chalk";

async function runTest(title: string, fn: () => Promise<void>) {
  console.log(
    chalk.cyan(
      `\n========================================\n${title}\n========================================`
    )
  );
  try {
    await fn();
    console.log(chalk.green(`\n✅ ${title} completed successfully!\n`));
  } catch (err) {
    console.error(chalk.red(`\n❌ Error in ${title}:`), err);
  }
}

async function main() {
  await runTest("Testing connection to SQL Server", async () => {
    const { default: testConnection } = await import("./testConnection.ts");
    await testConnection();
  });

  await runTest("Testing account services", async () => {
    const { default: testAccounts } = await import("./testAccounts.ts");
    await testAccounts();
  });

  await runTest("Testing HTTP routes", async () => {
    const { default: testRoutes } = await import("./testRoutes.ts");
    await testRoutes();
  });

  console.log(chalk.magenta("\n🎉 Todos os testes foram executados!"));
}

main();
